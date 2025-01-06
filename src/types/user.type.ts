export type LoginVo = {
  accessToken: string;
  refreshToken: string;
};

export type UserDto = {
  id: string;
  username: string;
  email: string;
  profile: {
    thumbnail: string;
  };
};
