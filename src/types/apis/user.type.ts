export type LoginVo = {
  accessToken: string;
  refreshToken: string;
};

export type UserDto = {
  user: {
    id: string;
    username: string;
    email: string;
    profile: {
      thumbnail: string;
    };
  };
};
