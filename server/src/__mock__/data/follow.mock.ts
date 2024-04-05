import { SelectFollowers } from "@/types/table.types";

const createFollower = (
  follower_id: number,
  followed_id: number
): SelectFollowers => ({
  follower_id: follower_id,
  followed_id: followed_id,
});

export { createFollower };
