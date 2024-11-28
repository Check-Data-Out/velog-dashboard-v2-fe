import { act, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Page from '@/app/(login)/page';
import fetchMock from 'jest-fetch-mock';
import { renderWithQueryClient } from '@/utils/test-util';
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(), // useRouter를 jest.fn()으로 설정
}));

describe('로그인 화면에서', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({}));
  });

  it('입력 칸이 하나라도 비어있으면 버튼이 비활성화된다.', async () => {
    renderWithQueryClient(<Page />);

    const buttonEl = screen.getByRole('button');
    const accessInputEl = screen.getByPlaceholderText(
      'Access Token을 입력하세요',
    );

    await userEvent.type(accessInputEl, 'access');

    expect(buttonEl).toBeDisabled();
  });

  it('액세스 토큰과 리프레시 토큰을 입력하면 버튼이 활성화된다', async () => {
    renderWithQueryClient(<Page />);

    const buttonEl = screen.getByRole('button');
    const accessInputEl = screen.getByPlaceholderText(
      'Access Token을 입력하세요',
    );
    const refrehsInputEl = screen.getByPlaceholderText(
      'Refresh Token을 입력하세요',
    );

    await userEvent.type(accessInputEl, 'access');
    await userEvent.type(refrehsInputEl, 'refresh');

    expect(buttonEl).toBeEnabled();
  });

  describe('API 요청에서', () => {
    it('액세스 토큰이 비정상적이면 오류 토스트가 표기된다', async () => {
      fetchMock.mockRejectOnce(new Error());

      renderWithQueryClient(
        <>
          <ToastContainer autoClose={2000} />
          <Page />
        </>,
      );

      const buttonEl = screen.getByRole('button');
      const accessInputEl = screen.getByPlaceholderText(
        'Access Token을 입력하세요',
      );
      const refrehsInputEl = screen.getByPlaceholderText(
        'Refresh Token을 입력하세요',
      );

      await userEvent.type(accessInputEl, 'invalid_access');
      await userEvent.type(refrehsInputEl, 'invalid_refresh');

      await act(async () => {
        // tanstack-query가 동작되는 게 state 변경이라 act가 없으면 오류 발생
        // (아마 act가 브라우저 환경을 모방하지 않을까 추측중)
        buttonEl.click();
      });

      const toastEl = screen.getByText('유효하지 않은 토큰 (404)'); // 이 메세지여야만 한다. (근데 Velog에서 반한하는 메세지가 뭔지 모르겠다)
      expect(toastEl).toBeInTheDocument();
    });

    it('액세스 토큰이 정상적이면 페이지를 대시보드로 이동시킨다', async () => {
      const replace = jest.fn();
      (useRouter as jest.Mock).mockImplementation(() => ({ replace }));

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => ({}),
      } as Response);

      renderWithQueryClient(<Page />);

      const buttonEl = screen.getByRole('button');
      const accessInputEl = screen.getByPlaceholderText(
        'Access Token을 입력하세요',
      );
      const refrehsInputEl = screen.getByPlaceholderText(
        'Refresh Token을 입력하세요',
      );

      await userEvent.type(accessInputEl, 'access');
      await userEvent.type(refrehsInputEl, 'refresh');
      await act(async () => buttonEl.click());

      expect(replace).toHaveBeenCalledWith('/main');
    });
  });
});
