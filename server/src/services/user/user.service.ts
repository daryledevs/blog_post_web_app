
import { FollowStatsType }                          from "@/repositories/follow/follow.repository";
import { SelectSearches, SelectUsers, UpdateUsers } from "@/types/table.types";

interface IUserService {
  getUserById(id: number): Promise<SelectUsers | undefined>;

  getUserByUsername(person: string): Promise<SelectUsers | undefined>;

  getUserByEmail(email: string): Promise<SelectUsers | undefined>;
  
  searchUserByFields(search: string): Promise<SelectUsers[]>;

  updateUser(id: number, user: UpdateUsers): Promise<UpdateUsers | undefined>;

  deleteUserById(id: number): Promise<string | undefined>;

  getAllRecentSearches(user_id: any): Promise<SelectSearches[] | undefined>;

  saveRecentSearches(user_id: any, search_user_id: any): Promise<string | undefined>;

  removeRecentSearches: (recent_id: any) => Promise<string | undefined>;

  getFollowStats: (user_id: any) => Promise<FollowStatsType>;

  getFollowerFollowingLists: (user_id: any, fetch: string, listsId: number[]) => Promise<SelectUsers[]>;

  toggleFollow: (user_id: any, followed_id: any) => Promise<string  | undefined>;
};

export default IUserService;