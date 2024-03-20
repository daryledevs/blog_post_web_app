import { Insertable, Selectable, Updateable } from "kysely";

interface FollowerTable {
  follower_id: number | null;
  followed_id: number | null;
  [key: string]: any;
};

export type Follower = Selectable<FollowerTable>;
export type NewFollower = Insertable<FollowerTable>;
export type UpdateFollower = Updateable<FollowerTable>;

export default FollowerTable;
