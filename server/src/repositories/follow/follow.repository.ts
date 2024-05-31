import { NewFollowers, SelectFollowers } from "@/types/table.types";

export type FollowStatsType = {
  followers: number;
  following: number;
};

interface IEFollowRepository {
  findUserFollowStatsById: (id: number) => Promise<FollowStatsType>;

  findAllFollowersById: (id: number, listsId: number[]) => Promise<SelectFollowers[]>;

  findAllFollowingById: (id: number, listsId: number[]) => Promise<SelectFollowers[]>;

  isUserFollowing: (identifier: NewFollowers) => Promise<boolean>;

  followUser: (identifier: NewFollowers) => Promise<void>;

  unfollowUser: (identifier: NewFollowers) => Promise<void>;
}

export default IEFollowRepository;