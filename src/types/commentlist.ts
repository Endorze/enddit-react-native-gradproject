export type CommentForPost = {
  id: number;
  post_id: string;
  content: string;
  created_at: string;
  parent_id: number | null;
  user: {
    username: string,
    id: string,
  };

};