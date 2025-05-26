import { LeaderboardListDto } from '@/types/leaderboard.type';
import { PATHS } from '@/constants';
import { instance } from './instance.request';

export const leaderboardList = async ({
  based,
  sort,
  dateRange,
  limit,
}: {
  based: string;
  sort: string;
  dateRange: string;
  limit: string;
}) =>
  await instance<null, LeaderboardListDto>(
    `${PATHS.LEADERBOARD}/${based}?sort=${sort}&dateRange=${dateRange}&limit=${limit}`,
  );
