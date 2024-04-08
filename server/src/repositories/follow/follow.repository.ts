import { NewFollowers, SelectFollowers } from "@/types/table.types";

export type FollowStatsType = {
  followers: number;
  following: number;
};

interface IFollowRepository {
  getFollowStats: (user_id: number) => Promise<FollowStatsType>;

  getFollowersLists: (user_id: number, listsId: number[]) => Promise<SelectFollowers[]>;

  getFollowingLists: (user_id: number, listsId: number[]) => Promise<SelectFollowers[]>;

  isFollowUser: (identifier: SelectFollowers) => Promise<boolean>;

  followUser: (identifier: NewFollowers) => Promise<void>;

  unfollowUser: (identifier: SelectFollowers) => Promise<void>;
}

export default IFollowRepository;