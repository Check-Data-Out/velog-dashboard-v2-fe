import { fetchOptions, FetchResponseError } from './fetch.error';

export class StatsAlreadyRefreshedError extends FetchResponseError {
  constructor(options: fetchOptions) {
    super({ code: 409, message: '통계가 최신 상태입니다.', options });
  }
}
