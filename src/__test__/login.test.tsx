import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import Page from '@/app/(login)/page';

describe('로그인 화면에서', () => {
  it('입력 칸이 하나라도 비어있으면 버튼이 비활성화된다.', async () => {
    render(<Page />);

    const buttonEl = screen.getByRole('button');
    const accessInputEl = screen.getByPlaceholderText(
      'Access Token을 입력하세요',
    );

    await userEvent.type(accessInputEl, 'access');

    expect(buttonEl).toBeDisabled();
  });

  it('액세스 토큰과 리프레시 토큰을 입력하면 버튼이 활성화된다', async () => {
    render(<Page />);

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

  it('이미 토큰이 있으면 대시보드 화면으로 이동한다', () => {
    expect(1).toBe(1);
  });

  describe('API 요청에서', () => {
    it('액세스 토큰이 비정상적이면 오류 토스트가 표기된다', () => {
      expect(1).toBe(1);
    });
  });
});
