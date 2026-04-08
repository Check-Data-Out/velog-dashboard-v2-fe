const mockRevalidatePath = jest.fn();
const mockRedirect = jest.fn();

jest.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

jest.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

describe('cache.util', () => {
  beforeEach(() => {
    jest.resetModules();
    mockRevalidatePath.mockClear();
    mockRedirect.mockClear();
  });

  describe('revalidate', () => {
    it("revalidatePath('/', 'layout')를 호출해야 한다", async () => {
      const { revalidate } = await import('../cache.util');
      await revalidate();
      expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it("redirect('/')를 호출해야 한다", async () => {
      const { revalidate } = await import('../cache.util');
      await revalidate();
      expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it('revalidatePath가 redirect보다 먼저 호출되어야 한다', async () => {
      const callOrder: string[] = [];
      mockRevalidatePath.mockImplementation(() => callOrder.push('revalidatePath'));
      mockRedirect.mockImplementation(() => callOrder.push('redirect'));

      const { revalidate } = await import('../cache.util');
      await revalidate();

      expect(callOrder).toEqual(['revalidatePath', 'redirect']);
    });

    it('revalidatePath와 redirect가 각각 한 번씩만 호출되어야 한다', async () => {
      const { revalidate } = await import('../cache.util');
      await revalidate();
      expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
      expect(mockRedirect).toHaveBeenCalledTimes(1);
    });
  });
});
