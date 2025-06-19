import { screen, waitFor } from '@testing-library/react';
import { Content } from '@/app/(auth-required)/main/Content';
import { Header } from '@/app/components/Header';
import { renderWithQueryClient } from './instance.test';

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    searchParams: [{ asc: 'false', sort: '' }],
  }),
  useRouter: () => ({
    replace: jest.fn(),
  }),
  usePathname: () => 'http://localhost:3000',
}));

jest.mock(`react-intersection-observer`, () => ({
  useInView: () => ({ ref: () => {}, inView: true }),
}));

const withFetch = (withOriginalFetch?: typeof global.fetch) => {
  if (withOriginalFetch) {
    global.fetch = withOriginalFetch;
    return;
  }

  const fetchApi = global.fetch;
  global.fetch = async (input, init) => {
    return await fetchApi(input, {
      ...init,
      headers: {
        ...Object.fromEntries(Array.from(init?.headers as Headers)),
        access_token: 'access',
        refresh_token: 'refresh',
      },
    });
  };
};

const originalFetch = () => global.fetch; // header가 없을 경우의 fetch

describe('메인(대시보드) 페이지에서', () => {
  describe('API에서', () => {
    it('401/403 오류가 발생하면 로그인 페이지로 이동한다.', async () => {
      withFetch(originalFetch());
      renderWithQueryClient(<Content />);
      const replace = jest.fn();

      const location = new URL('http://localhost:3000');
      (location as unknown as Location).replace = replace;

      delete (window as unknown as Partial<Window>).location;
      window.location = location as unknown as Location;

      await waitFor(() => expect(replace).toHaveBeenCalledWith('/'));
    });

    it('프로필 API 요청이 성공하면 정상적으로 데이터를 표시한다', async () => {
      withFetch();
      renderWithQueryClient(<Header />);

      const profile = await screen.findByText('test');

      expect(profile).not.toBeUndefined();
    });

    it('게시글 정보 요약 API 요청이 성공하면 정상적으로 데이터를 표시한다', async () => {
      withFetch();
      const { container } = renderWithQueryClient(<Content />);

      await waitFor(() =>
        // eslint-disable-next-line
        expect(container.querySelector('span#totalViews')?.innerHTML).toBe('100회'),
      );
    });
  });
});
