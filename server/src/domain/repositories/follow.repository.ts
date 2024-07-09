import Follower         from "@/domain/models/follower.model";
import Following        from "@/domain/models/following.model";
import { NewFollowers } from "@/domain/types/table.types";

export type FollowStatsType = {
  followers: number;
  following: number;
};

interface IEFollowRepository {
  findUserFollowStatsById: (id: number) => Promise<FollowStatsType>;

  findAllFollowersById: (id: number, listsId: number[]) => Promise<Follower[]>;

  findAllFollowingById: (id: number, listsId: number[]) => Promise<Following[]>;

  isUserFollowing: (identifier: NewFollowers) => Promise<boolean>;

  followUser: (identifier: NewFollowers) => Promise<void>;

  unfollowUser: (identifier: NewFollowers) => Promise<void>;
}

export default IEFollowRepository;