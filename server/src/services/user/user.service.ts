
import { FollowStatsType }                          from "@/repositories/follow/follow.repository";
import { SelectSearches, SelectUsers, UpdateUsers } from "@/types/table.types";

interface IUserService {
  getUserById(id: number): Promise<SelectUsers | undefined>;

  getUserByUsername(person: string): Promise<SelectUsers | undefined>;

  getUserByEmail(email: string): Promise<SelectUsers | undefined>;
  
  searchUserByFields(search: string): Promise<SelectUsers[]>;

  updateUser(id: number, user: UpdateUsers): Promise<UpdateUsers>;

  deleteUserById(id: number): Promise<string | undefined>;
};

export default IUserService;