type LeaderboardListUser = {
  id: string;
  email: string;
  username: string;
  totalViews: string;
  totalLikes: string;
  totalPosts: string;
  viewDiff: string;
  likeDiff: string;
  postDiff: string;
};
type LeaderboardListPost = {
  id: string;
  title: string;
  slug: string;
  username: string;
  totalViews: number;
  totalLikes: number;
  viewDiff: number;
  likeDiff: number;
  releasedAt: string;
};

export type LeaderboardListDto = {
  users?: LeaderboardListUser[];
  posts?: LeaderboardListPost[];
};

export type LeaderboardItemType = NonNullable<LeaderboardListUser> &
  NonNullable<LeaderboardListPost>;
