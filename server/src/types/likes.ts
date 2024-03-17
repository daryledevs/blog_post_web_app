import { Insertable, Selectable, Updateable } from "kysely";

interface LikeTable {
  post_id: number;
  user_id: number;
  like_date: string;
};

export type Like = Selectable<LikeTable>;
export type NewLike = Insertable<LikeTable>;
export type UpdateLike = Updateable<LikeTable>;

export default LikeTable;
