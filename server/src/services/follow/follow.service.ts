import { SelectFollowers } from "@/types/table.types";
import { FollowStatsType } from "@/repositories/follow/follow.repository";
import FollowerDto from "@/dto/follower.dto";
import FollowingDto from "@/dto/following.dto";

interface IEFollowService {
  getFollowStats: (uuid: string | undefined) => Promise<FollowStatsType>;

  getFollowerFollowingLists: (uuid: string | undefined, fetch: string, listsId: number[]) => Promise<FollowerDto[] | FollowingDto[]>;

  toggleFollow: (follower_id: string | undefined, followed_id: string | undefined) => Promise<string>;
};

export default IEFollowService;