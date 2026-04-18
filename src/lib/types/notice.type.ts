export type NotiListDto = {
  posts: Array<{
    id: number;
    title: string;
    content: string;
    created_at: string;
  }>;
};
