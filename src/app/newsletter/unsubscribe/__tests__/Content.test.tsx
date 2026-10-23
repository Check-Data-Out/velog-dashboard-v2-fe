import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
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

// 앱 QueryClient 와 같은 오류 정책(throwOnError: errorHandler)을 써서 전역 토스트가 뜨지 않는지 확인한다
const renderContent = (uid?: string, sig?: string) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { mutations: { retry: false, throwOnError: errorHandler } },
        })
      }
    >
      <Content uid={uid} sig={sig} />
    </QueryClientProvider>,
  );

describe('뉴스레터 수신거부 확인 화면', () => {
  beforeEach(() => {
    mockInstance.mockReset();
    mockReplace.mockClear();
    mockToastError.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('질문과 수신거부·취소 버튼을 보여 주고 열기만 해서는 요청하지 않는다', () => {
    renderContent('42', 'sig');

    expect(
      screen.getByRole('heading', { name: 'Velog Dashboard 주간 뉴스레터를 그만 받을까요?' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수신거부' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeEnabled();
    expect(mockInstance).not.toHaveBeenCalled();
  });

  it('수신거부를 누르면 요청하고 완료 문구를 보여 준다', async () => {
    mockInstance.mockResolvedValueOnce(undefined);
    renderContent('42', 'sig');

    await userEvent.click(screen.getByRole('button', { name: '수신거부' }));

    expect(
      await screen.findByText('수신거부했어요. 다음 주부터 뉴스레터가 발송되지 않아요.'),
    ).toBeInTheDocument();
    expect(mockInstance).toHaveBeenCalledTimes(1);
  });

  it('서명이 맞지 않으면(400) 안내 문구를 보여 주고 토스트는 띄우지 않는다', async () => {
    mockInstance.mockRejectedValueOnce(
      new UnknownError({ url: '/api/user/newsletter-unsubscribe', method: 'POST' }, 400),
    );
    renderContent('42', 'wrong');

    await userEvent.click(screen.getByRole('button', { name: '수신거부' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(INVALID_MESSAGE);
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('uid 나 sig 가 없으면 처음부터 안내 문구를 보여 주고 요청하지 않는다', () => {
    renderContent(undefined, 'sig');

    expect(screen.getByRole('alert')).toHaveTextContent(INVALID_MESSAGE);
    expect(screen.getByRole('button', { name: '수신거부' })).toBeDisabled();
  });

  it('취소하면 요청 없이 첫 화면으로 이동한다', async () => {
    renderContent('42', 'sig');

    await userEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(mockInstance).not.toHaveBeenCalled();
  });
});
