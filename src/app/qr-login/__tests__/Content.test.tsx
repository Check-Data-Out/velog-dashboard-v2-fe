import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { instance } from '@/lib/apis/instance.request';
import { PATHS } from '@/lib/constants/paths.constant';
import { UnknownError } from '@/lib/errors/fetch.error';
import { errorHandler } from '@/lib/utils/error.util';
import { Content } from '../Content';

jest.mock('../../../lib/apis/instance.request', () => ({
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

const EXPIRED_MESSAGE =
  'QR 코드가 만료됐거나 이미 사용됐어요. PC에서 QR을 새로고침한 뒤 다시 스캔해 주세요.';

const confirmOptions = { url: '/api/qr-login/confirm', method: 'POST' };

// 앱 QueryClient 와 같은 오류 정책(throwOnError: errorHandler)을 써서 전역 토스트가 뜨지 않는지 확인한다
const renderContent = (token?: string) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: { mutations: { retry: false, throwOnError: errorHandler } },
        })
      }
    >
      <Content token={token} />
    </QueryClientProvider>,
  );

describe('QR 로그인 확인 화면', () => {
  beforeEach(() => {
    mockInstance.mockReset();
    mockReplace.mockClear();
    mockToastError.mockClear();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('질문, 경고 문구와 로그인·취소 버튼을 보여 주고 열기만 해서는 요청하지 않는다', () => {
    renderContent('abcde12345');

    expect(
      screen.getByRole('heading', { name: '이 기기에서 Velog Dashboard에 로그인할까요?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'PC 화면에 띄운 QR을 본인이 직접 스캔한 경우에만 로그인하세요. 다른 사람이 보낸 링크라면 취소하세요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeEnabled();
    expect(mockInstance).not.toHaveBeenCalled();
  });

  it('로그인을 누르면 token으로 로그인을 확인하고 대시보드로 이동한다', async () => {
    mockInstance.mockResolvedValueOnce(undefined);
    renderContent('abcde12345');

    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(mockInstance).toHaveBeenCalledWith(PATHS.QRLOGIN_CONFIRM, {
      method: 'POST',
      body: { token: 'abcde12345' },
    });
    expect(mockReplace).toHaveBeenCalledWith('/main');
  });

  it('토큰이 만료됐거나 사용됐으면(400) 토스트 없이 만료 안내를 보여 준다', async () => {
    mockInstance.mockRejectedValueOnce(new UnknownError(confirmOptions, 400));
    renderContent('abcde12345');

    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText(EXPIRED_MESSAGE)).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('그 밖의 오류면 토스트 없이 일반 오류 안내를 보여 준다', async () => {
    mockInstance.mockRejectedValueOnce(new UnknownError(confirmOptions, 500));
    renderContent('abcde12345');

    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(await screen.findByText(/로그인하지 못했어요/)).toBeInTheDocument();
    expect(screen.queryByText(EXPIRED_MESSAGE)).not.toBeInTheDocument();
    expect(mockToastError).not.toHaveBeenCalled();
  });

  it('token이 없으면 처음부터 만료 안내를 보여 주고 로그인할 수 없다', () => {
    renderContent();

    expect(screen.getByText(EXPIRED_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('요청 중에는 버튼을 누를 수 없다', async () => {
    mockInstance.mockReturnValueOnce(new Promise(() => {}));
    renderContent('abcde12345');

    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '취소' })).toBeDisabled();
  });

  it('취소를 누르면 요청 없이 첫 화면으로 이동한다', async () => {
    renderContent('abcde12345');

    await userEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(mockReplace).toHaveBeenCalledWith('/');
    expect(mockInstance).not.toHaveBeenCalled();
  });
});
