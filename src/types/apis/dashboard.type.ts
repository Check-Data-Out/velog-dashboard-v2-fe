export type PostType = {
  id: string;
  title: string;
  createdAt: string;
  releasedAt: string;
  views: number;
  likes: number;
  yesterdayViews: number;
  yesterdayLikes: number;
};

export type PostListDto = {
  nextCursor: number | null;
  totalCounts: number;
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
