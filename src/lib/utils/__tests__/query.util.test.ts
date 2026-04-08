jest.mock('@sentry/nextjs', () => ({
  withScope: jest.fn(),
  captureException: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

const isQueryClient = (client: unknown): boolean =>
  typeof client === 'object' &&
  client !== null &&
  typeof (client as Record<string, unknown>).getDefaultOptions === 'function' &&
  typeof (client as Record<string, unknown>).invalidateQueries === 'function';

describe('query.util', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe('getQueryClient', () => {
    it('QueryClient 인스턴스를 반환해야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      expect(isQueryClient(client)).toBe(true);
    });

    it('브라우저 환경에서는 동일한 인스턴스(싱글톤)를 반환해야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const first = getQueryClient();
      const second = getQueryClient();
      expect(first).toBe(second);
    });

    it('반환된 QueryClient의 queries.retry가 false여야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(options.queries?.retry).toBe(false);
    });

    it('반환된 QueryClient의 queries.refetchOnWindowFocus가 false여야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(options.queries?.refetchOnWindowFocus).toBe(false);
    });

    it('반환된 QueryClient의 mutations.retry가 false여야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(options.mutations?.retry).toBe(false);
    });

    it('반환된 QueryClient의 queries.staleTime이 180000(3분)이어야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(options.queries?.staleTime).toBe(1000 * 60 * 3);
    });

    it('반환된 QueryClient의 queries.gcTime이 1200000(20분)이어야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(options.queries?.gcTime).toBe(1000 * 60 * 20);
    });

    it('반환된 QueryClient의 queries.refetchOnMount가 true여야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(options.queries?.refetchOnMount).toBe(true);
    });

    it('반환된 QueryClient의 queries.throwOnError가 함수여야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(typeof options.queries?.throwOnError).toBe('function');
    });

    it('반환된 QueryClient의 mutations.throwOnError가 함수여야 한다', async () => {
      const { getQueryClient } = await import('../query.util');
      const client = getQueryClient();
      const options = client.getDefaultOptions();
      expect(typeof options.mutations?.throwOnError).toBe('function');
    });

    it('SSR 환경에서는 매번 새로운 인스턴스를 반환해야 한다', async () => {
      const windowSpy = jest.spyOn(global, 'window', 'get').mockReturnValue(undefined as never);
      try {
        const { getQueryClient } = await import('../query.util');
        const first = getQueryClient();
        const second = getQueryClient();
        expect(first).not.toBe(second);
        expect(isQueryClient(first)).toBe(true);
        expect(isQueryClient(second)).toBe(true);
      } finally {
        windowSpy.mockRestore();
      }
    });
  });
});
