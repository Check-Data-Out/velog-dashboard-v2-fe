import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// MSW 워커 설정
export const worker = setupWorker(...handlers);

// 브라우저에서 MSW 시작
export const startWorker = async () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
};

// 브라우저에서 MSW 중지
export const stopWorker = () => {
  if (typeof window !== 'undefined') {
    worker.stop();
  }
};

// 브라우저에서 MSW 리셋
export const resetWorker = () => {
  if (typeof window !== 'undefined') {
    worker.resetHandlers();
  }
};
