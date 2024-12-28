export type PostType = {
  id: string;
  title: string;
  createdAt: string;
  releasedAt: string;
  views: number;
  likes: number;
};

export type PostListDto = {
  nextCursor: number | null;
  totalCounts: number;
  posts: PostType[];
};
