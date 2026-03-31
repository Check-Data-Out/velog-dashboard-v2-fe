export type LoginVo = {
  accessToken: string;
  refreshToken: string;
};

export type UserDto = {
  id: string;
  username: string;
  email: string;
  profile: {
    thumbnail?: string;
  };
};

export type recentPosts = {
  title: string;
  releasedAt: string;
  viewCount: number;
  likeCount: number;
  viewDiff: number;
};

export type BadgeDto = {
  user: {
    username: string;
    totalViews: number;
    totalLikes: number;
    totalPosts: number;
    viewDiff: number;
    likeDiff: number;
    postDiff: number;
  };
  recentPosts: recentPosts[];
};
