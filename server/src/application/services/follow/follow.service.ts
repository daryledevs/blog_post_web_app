import { FollowStatsType } from "@/domain/repositories/follow.repository";
import FollowerDto from "@/domain/dto/follower.dto";
import FollowingDto from "@/domain/dto/following.dto";

interface IEFollowService {
  getFollowStats: (uuid: string) => Promise<FollowStatsType>;

  getFollowerFollowingLists: (uuid: string, fetchFollowType: string, listsId: number[]) => Promise<FollowerDto[] | FollowingDto[]>;

  toggleFollow: (follower_id: string, followed_id: string) => Promise<string>;
};

export default IEFollowService;