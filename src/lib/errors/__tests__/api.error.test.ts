import { StatsAlreadyRefreshedError } from '../api.error';
import { FetchResponseError } from '../fetch.error';

const mockOptions = { url: '/api/stats-refresh', method: 'POST' };

describe('StatsAlreadyRefreshedError', () => {
  it('FetchResponseError를 상속해야 한다', () => {
    const error = new StatsAlreadyRefreshedError(mockOptions);
    expect(error).toBeInstanceOf(FetchResponseError);
    expect(error).toBeInstanceOf(Error);
  });

  it('code가 409여야 한다', () => {
    const error = new StatsAlreadyRefreshedError(mockOptions);
    expect(error.code).toBe(409);
  });

  it('올바른 메시지를 가져야 한다', () => {
    const error = new StatsAlreadyRefreshedError(mockOptions);
    expect(error.message).toBe('통계가 최신 상태입니다.');
  });

  it('options를 올바르게 설정해야 한다', () => {
    const error = new StatsAlreadyRefreshedError(mockOptions);
    expect(error.options).toBe(mockOptions);
  });

  it('shouldCaptureException이 false여야 한다 (409 < 500)', () => {
    const error = new StatsAlreadyRefreshedError(mockOptions);
    expect(error.shouldCaptureException).toBe(false);
  });

  it('name이 "StatsAlreadyRefreshedError"여야 한다', () => {
    const error = new StatsAlreadyRefreshedError(mockOptions);
    expect(error.name).toBe('StatsAlreadyRefreshedError');
  });

  it('getToastMessage가 올바른 형식을 반환해야 한다', () => {
    const error = new StatsAlreadyRefreshedError(mockOptions);
    expect(error.getToastMessage()).toBe('통계가 최신 상태입니다. (409)');
  });
});
