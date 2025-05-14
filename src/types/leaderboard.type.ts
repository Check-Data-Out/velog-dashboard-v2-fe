export type LeaderboardListDto = {
  users?: Array<{
    id: string;
    email: string;
    totalViews: string;
    totalLikes: string;
    totalPosts: string;
    viewDiff: string;
    likeDiff: string;
    postDiff: string;
  }>;
  posts?: Array<{
    id: string;
    title: string;
    slug: string;
    totalViews: number;
    totalLikes: number;
    viewDiff: number;
    likeDiff: number;
    releasedAt: string;
  }>;
};

export type LeaderboardItemType = NonNullable<LeaderboardListDto['users']>[number] &
  NonNullable<LeaderboardListDto['posts']>[number];
