// MSW 서버 설정 (Node.js 환경에서만 사용)
export const createMSWServer = async () => {
  if (typeof window !== 'undefined') {
    throw new Error('MSW server should only be used in Node.js environment');
  }

  const { setupServer } = await import('msw/node');
  const { handlers } = await import('./handlers');

  return setupServer(...handlers);
};

// Cypress에서 사용할 서버 인스턴스
let serverInstance: Awaited<ReturnType<typeof createMSWServer>> | null = null;

// 테스트 환경에서 서버 시작
export const startServer = async () => {
  if (!serverInstance) {
    serverInstance = await createMSWServer();
  }
  serverInstance.listen({
    onUnhandledRequest: 'error',
  });
};

// 테스트 환경에서 서버 중지
export const stopServer = () => {
  if (serverInstance) {
    serverInstance.close();
  }
};

// 테스트 환경에서 서버 리셋
export const resetServer = () => {
  if (serverInstance) {
    serverInstance.resetHandlers();
  }
};
