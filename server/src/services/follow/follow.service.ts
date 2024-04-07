import { SelectUsers }     from "@/types/table.types";
import { FollowStatsType } from "@/repositories/follow/follow.repository";

interface IFollowService {
  getFollowStats: (user_id: any) => Promise<FollowStatsType>;

  getFollowerFollowingLists: (user_id: any, fetch: string, listsId: number[]) => Promise<SelectUsers[]>;

  toggleFollow: (user_id: any, followed_id: any) => Promise<string>;
};

export default IFollowService;