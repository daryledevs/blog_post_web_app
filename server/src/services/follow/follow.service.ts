import { SelectFollowers } from "@/types/table.types";
import { FollowStatsType } from "@/repositories/follow/follow.repository";

interface IFollowService {
  getFollowStats: (uuid: string | undefined) => Promise<FollowStatsType>;

  getFollowerFollowingLists: (uuid: string | undefined, fetch: string, listsId: number[]) => Promise<SelectFollowers[]>;

  toggleFollow: (follower_id: string | undefined, followed_id: string | undefined) => Promise<string>;
};

export default IFollowService;