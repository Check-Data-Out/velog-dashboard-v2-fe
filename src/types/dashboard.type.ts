export type PostType = {
  id: string;
  title: string;
  createdAt: string;
  releasedAt: string;
  views: number;
  likes: number;
  slug: string;
  yesterdayViews: number;
  yesterdayLikes: number;
};

export type PostListDto = {
  nextCursor: string;
  posts: PostType[];
};

export type PostSummaryDto = {
  totalPostCount: number;
  stats: {
    totalViews: number;
    totalLikes: number;
    yesterdayViews: number;
    yesterdayLikes: number;
    lastUpdatedDate: string;
  };
};

export type PostDetailValue = {
  date: string;
  dailyViewCount: number;
  dailyLikeCount: number;
};

export type PostDetailDto = {
  post: PostDetailValue[];
};

export type TotalStatsDto = Array<{ date: string; value: number }>;

export type RefreshStatsDto = {
  lastUpdatedAt?: string;
};
