import { NewFollowers, SelectFollowers } from "@/types/table.types";

export type FollowStatsType = {
  followers: number;
  following: number;
};

interface IFollowRepository {
  getFollowStats: (user_id: number) => Promise<FollowStatsType>;

  getFollowersLists: (user_id: number, listsId: number[]) => Promise<any>;

  getFollowingLists: (user_id: number, listsId: number[]) => Promise<any>;

  isFollowUser: (identifier: SelectFollowers) => Promise<boolean>;

  followUser: (identifier: NewFollowers) => Promise<string | undefined>;

  unfollowUser: (identifier: SelectFollowers) => Promise<string | undefined>;
}

export default IFollowRepository;