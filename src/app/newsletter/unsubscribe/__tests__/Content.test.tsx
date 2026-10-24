import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { renderToString } from 'react-dom/server';
import { toast } from 'react-toastify';
import { instance } from '@/lib/apis/instance.request';
import { UnknownError } from '@/lib/errors/fetch.error';
import { errorHandler } from '@/lib/utils/error.util';
import { Content } from '../Content';

jest.mock('../../../../lib/apis/instance.request', () => ({
  instance: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  withScope: jest.fn(),
}));

const mockInstance = instance as jest.Mock;
const mockReplace = jest.fn();
const mockToastError = toast.error as unknown as jest.Mock;

const INVALID_MESSAGE = '링크가 올바르지 않아요. 최근 받은 메일의 링크를 사용해 주세요.';
const ERROR_MESSAGE = '수신거부하지 못했어요. 잠시 후 다시 시도해 주세요.';

// 앱 QueryClient 와 같은 오류 정책(throwOnError: errorHandler)을 써서 전역 토스트가 뜨지 않는지 확인한다
const withQueryClient = () => (
  <QueryClientProvider
    client={
      new QueryClient({
        defaultOptions: { mutations: { retry: false, throwOnError: errorHandler } },
      })
    }
  >
    <Content />
  </QueryClientProvider>
);

// 메일 링크는 서명이 분석 도구에 남지 않도록 uid·sig 를 fragment 로 넘긴다
const renderContent = (hash: string) => {
  window.location.hash = hash;
  return render(withQueryClient());
};

describe('뉴스레터 수신거부 확인 화면', () => {
  beforeEach(() => {
    mockInstance.mockReset();
    mockReplace.mockClear();
    mockToastError.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    window.location.hash = '';
  });

  it('질문과 수신거부·취소 버튼을 보여 주고 열기만 해서는 요청하지 않는다', () => {
    renderContent('#uid=42&sig=sig');

    expect(
      screen.getByRole('heading', { name: 'Velog Dashboard 주간 뉴스레터를 그만 받을까요?' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수신거부' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeEnabled();
    expect(mockInstance).not.toHaveBeenCalled();
  });

  it('수신거부를 누르면 fragment 의 uid·sig 를 query 로 담아 요청하고 완료 문구를 보여 준다', async () => {
    mockInstance.mockResolvedValueOnce(undefined);
    renderContent('#uid=42&sig=a-b_c');

    await userEvent.click(screen.getByRole('button', { name: '수신거부' }));

    expect(
      await screen.findByText('수신거부했어요. 다음 주부터 뉴스레터가 발송되지 않아요.'),
    ).toBeInTheDocument();
    expect(mockInstance).toHaveBeenCalledTimes(1);
    expect(mockInstance).toHaveBeenCalledWith(
      expect.stringMatching(/\?uid=42&sig=a-b_c$/),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('서명이 맞지 않으면(400) 안내 문구를 보여 주고 토스트는 띄우지 않는다', async () => {
    mockInstance.mockRejectedValueOnce(
      new UnknownError({ url: '/api/user/newsletter-unsubscribe', method: 'POST' }, 400),
    );
    renderContent('#uid=42&sig=wrong');

    await userEvent.click(screen.getByRole('button', { name: '수신거부' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(INVALID_MESSAGE);
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('서버 오류(500)면 다시 시도하라는 문구를 보여 주고 버튼을 다시 누를 수 있으며 토스트는 띄우지 않는다', async () => {
    mockInstance.mockRejectedValueOnce(
      new UnknownError({ url: '/api/user/newsletter-unsubscribe', method: 'POST' }, 500),
    );
    renderContent('#uid=42&sig=sig');

    await userEvent.click(screen.getByRole('button', { name: '수신거부' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(ERROR_MESSAGE);
    expect(screen.getByRole('button', { name: '수신거부' })).toBeEnabled();
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('같은 탭에서 fragment 가 바뀌면 이전 오류를 지우고 새 링크의 uid·sig 로 요청한다', async () => {
    mockInstance
      .mockRejectedValueOnce(
        new UnknownError({ url: '/api/user/newsletter-unsubscribe', method: 'POST' }, 400),
      )
      .mockResolvedValueOnce(undefined);
    renderContent('#uid=42&sig=old');
    await userEvent.click(screen.getByRole('button', { name: '수신거부' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(INVALID_MESSAGE);

    act(() => {
      window.location.hash = '#uid=43&sig=new';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '수신거부' }));

    expect(mockInstance).toHaveBeenLastCalledWith(
      expect.stringMatching(/\?uid=43&sig=new$/),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('uid 나 sig 가 없으면 처음부터 안내 문구를 보여 주고 요청하지 않는다', () => {
    renderContent('#sig=sig');

    expect(screen.getByRole('alert')).toHaveTextContent(INVALID_MESSAGE);
    expect(screen.getByRole('button', { name: '수신거부' })).toBeDisabled();
  });

  it('fragment 를 읽기 전(서버 렌더)에는 안내 문구 없이 수신거부 버튼만 막아 둔다', () => {
    window.location.hash = '#uid=42&sig=sig';

    const view = renderToString(withQueryClient());

    expect(view).not.toContain(INVALID_MESSAGE);
    expect(view).toMatch(/<button[^>]*disabled[^>]*>수신거부<\/button>/);
  });

  it('취소하면 요청 없이 첫 화면으로 이동한다', async () => {
    renderContent('#uid=42&sig=sig');

    await userEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(mockInstance).not.toHaveBeenCalled();
  });
});
