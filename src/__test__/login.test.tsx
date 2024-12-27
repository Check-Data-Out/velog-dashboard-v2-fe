import { userEvent } from '@testing-library/user-event';
import { act, screen } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import fetchMock from 'jest-fetch-mock';
import { renderWithQueryClient } from '@/utils/componentUtil';
import { TimeoutError } from '@/errors';
import { default as Login } from '@/app/(with-tracker)/(login)/page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const getElements = () => {
  const buttonEl = screen.getByRole('button');
  const accessInputEl = screen.getByPlaceholderText(
    'Access Token을 입력하세요',
  );
  const refreshInputEl = screen.getByPlaceholderText(
    'Refresh Token을 입력하세요',
  );

  return { buttonEl, accessInputEl, refreshInputEl };
};

const renderPage = () => {
  renderWithQueryClient(
    <>
      <ToastContainer autoClose={2000} />
      <Login />
    </>,
  );
};

describe('로그인 화면에서', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({}));
  });

  it('입력 칸이 하나라도 비어있으면 버튼이 비활성화된다.', async () => {
    renderPage();

    const { buttonEl, accessInputEl } = getElements();

    await userEvent.type(accessInputEl, 'access');

    expect(buttonEl).toBeDisabled();
  });

  it('액세스 토큰과 리프레시 토큰을 입력하면 버튼이 활성화된다', async () => {
    renderPage();

    const { buttonEl, accessInputEl, refreshInputEl } = getElements();

    await userEvent.type(accessInputEl, 'access');
    await userEvent.type(refreshInputEl, 'refresh');

    expect(buttonEl).toBeEnabled();
  });

  describe('API 요청에서', () => {
    it('서버가 응답하지 않으면 응답 없음 토스트가 표시된다', async () => {
      renderPage();

      fetchMock.mockRejectedValueOnce(new TimeoutError());

      const { buttonEl, accessInputEl, refreshInputEl } = getElements();

      await userEvent.type(accessInputEl, 'invalid_access');
      await userEvent.type(refreshInputEl, 'invalid_refresh');
      await act(async () => buttonEl.click());

      const toastEl = screen.getByText('잠시 후 다시 시도해 주세요');
      expect(toastEl).not.toBeUndefined();
    });

    it('액세스 토큰이 비정상적이면 오류 토스트가 표기된다', async () => {
      renderPage();
      fetchMock.mockResolvedValueOnce({ ok: false, status: 404 } as Response);

      const { buttonEl, accessInputEl, refreshInputEl } = getElements();

      await userEvent.type(accessInputEl, 'invalid_access');
      await userEvent.type(refreshInputEl, 'invalid_refresh');
      await act(async () => buttonEl.click());

      const toastEl = screen.getByText('일치하는 계정을 찾을 수 없습니다');
      expect(toastEl).not.toBeUndefined();
    });

    it('요청이 성공하면 페이지를 대시보드로 이동시킨다', async () => {
      renderPage();

      const replace = jest.fn();
      (useRouter as jest.Mock).mockImplementation(() => ({ replace }));

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
      } as Response);

      const { buttonEl, accessInputEl, refreshInputEl } = getElements();

      await userEvent.type(accessInputEl, 'access');
      await userEvent.type(refreshInputEl, 'refresh');
      await act(async () => buttonEl.click());

      expect(replace).toHaveBeenCalledWith('/main');
    });
  });
});
