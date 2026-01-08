import { CustomError } from './instance.error';

export class StatsAlreadyRefreshedError extends CustomError {
  constructor() {
    super(
      '이미 통계가 최신 상태이거나 새로고침이 진행되고 있습니다',
      'StatsAlreadyRefreshed',
      409,
      false,
    );
  }
}
