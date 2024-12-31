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
  daily_view_count: number;
  daily_like_count: number;
};

export type PostDetailDto = {
  post: PostDetailValue[];
};
