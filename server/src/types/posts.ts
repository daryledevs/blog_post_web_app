import { Generated, Insertable, Selectable, Updateable } from "kysely";

interface PostTable {
  post_id: Generated<number>;
  user_id: number;
  image_id: string;
  caption?: string | null;
  image_url: string | null;
  privacy_level?: string | "public" | "private";
  post_date: Generated<Date>;
};

export type Post = Selectable<PostTable>;
export type NewPost = Insertable<PostTable>;
export type UpdatePost = Updateable<PostTable>;

export default PostTable;
