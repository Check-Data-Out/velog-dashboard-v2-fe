import { renderHook, act } from '@testing-library/react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useSearchParam } from '../useSearchParam';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

const mockPush = jest.fn();
const mockReplace = jest.fn();

describe('useSearchParam', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''));
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush, replace: mockReplace });
    (usePathname as jest.Mock).mockReturnValue('/main');
  });

  it('현재 searchParams를 객체로 반환해야 한다', () => {
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('sort=view&asc=false'));
    const { result } = renderHook(() => useSearchParam<{ sort: string; asc: string }>());
    const [params] = result.current;

    expect(params.sort).toBe('view');
    expect(params.asc).toBe('false');
  });

  it('searchParams가 없으면 빈 객체를 반환해야 한다', () => {
    const { result } = renderHook(() => useSearchParam());
    const [params] = result.current;

    expect(params).toEqual({});
  });

  describe('setSearchParams', () => {
    it('기본으로 router.push를 호출해야 한다', () => {
      const { result } = renderHook(() => useSearchParam<{ sort: string }>());
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({ sort: 'like' });
      });

      expect(mockPush).toHaveBeenCalledWith('/main?sort=like');
      expect(mockReplace).not.toHaveBeenCalled();
    });

    it('isReplace가 true일 때 router.replace를 호출해야 한다', () => {
      const { result } = renderHook(() => useSearchParam<{ sort: string }>());
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({ sort: 'like' }, true);
      });

      expect(mockReplace).toHaveBeenCalledWith('/main?sort=like');
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('기존 searchParams에 새 param을 추가해야 한다', () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('asc=true'));
      const { result } = renderHook(() => useSearchParam<{ sort: string; asc: string }>());
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({ sort: 'view' });
      });

      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=view'));
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('asc=true'));
    });

    it('기존 param을 새 값으로 덮어써야 한다', () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('sort=view'));
      const { result } = renderHook(() => useSearchParam<{ sort: string }>());
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({ sort: 'like' });
      });

      expect(mockPush).toHaveBeenCalledWith('/main?sort=like');
    });

    it('null 값이 전달되면 해당 param을 제거해야 한다', () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('sort=view&asc=true'));
      const { result } = renderHook(() => useSearchParam<{ sort: string; asc: string }>());
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({ sort: null as unknown as string });
      });

      const calledUrl = mockPush.mock.calls[0][0] as string;
      expect(calledUrl).not.toContain('sort=');
      expect(calledUrl).toContain('asc=true');
    });

    it('pathname을 포함한 올바른 URL로 이동해야 한다', () => {
      (usePathname as jest.Mock).mockReturnValue('/leaderboards');
      const { result } = renderHook(() => useSearchParam<{ tab: string }>());
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({ tab: 'users' });
      });

      expect(mockPush).toHaveBeenCalledWith('/leaderboards?tab=users');
    });

    it('특수 문자가 포함된 값도 올바르게 인코딩되어야 한다', () => {
      const { result } = renderHook(() => useSearchParam<{ query: string }>());
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({ query: 'hello world & more' });
      });

      const calledUrl = mockPush.mock.calls[0][0] as string;
      expect(calledUrl).toContain('query=hello+world+%26+more');
    });

    it('여러 param을 동시에 null로 전달하면 모두 제거되어야 한다', () => {
      (useSearchParams as jest.Mock).mockReturnValue(
        new URLSearchParams('sort=view&asc=true&limit=10'),
      );
      const { result } = renderHook(() =>
        useSearchParam<{ sort: string; asc: string; limit: string }>(),
      );
      const [, setSearchParams] = result.current;

      act(() => {
        setSearchParams({
          sort: null as unknown as string,
          asc: null as unknown as string,
        });
      });

      const calledUrl = mockPush.mock.calls[0][0] as string;
      expect(calledUrl).not.toContain('sort=');
      expect(calledUrl).not.toContain('asc=');
      expect(calledUrl).toContain('limit=10');
    });
  });
});
