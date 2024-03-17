import { Insertable, Selectable, Updateable } from "kysely";

interface PostTable {
  post_id: number;
  user_id: number;
  image_id: number;
  caption: string | null;
  image_url: string | null;
  privacy_level: "public" | "private";
  post_date: string;
};

export type Post = Selectable<PostTable>;
export type NewPost = Insertable<PostTable>;
export type UpdatePost = Updateable<PostTable>;

export default PostTable;
