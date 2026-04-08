import { PATHS } from '@/lib/constants/paths.constant';
import { LeaderboardListDto } from '@/lib/types/leaderboard.type';
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
