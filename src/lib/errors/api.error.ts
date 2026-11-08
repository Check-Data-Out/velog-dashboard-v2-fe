import { fetchOptions, FetchResponseError } from './fetch.error';

export class StatsAlreadyRefreshedError extends FetchResponseError {
  name = 'StatsAlreadyRefreshedError';
  constructor(options: fetchOptions) {
    super({ code: 409, message: '통계가 최신 상태입니다.', options });
  }
}

export class VelogUnavailableError extends FetchResponseError {
  name = 'VelogUnavailableError';
  constructor(options: fetchOptions) {
    super({
      code: 503,
      message: 'Velog 응답이 늦어 로그인하지 못했습니다. 잠시 후 다시 시도해주세요.',
      options,
    });
  }
}
