
import UserDto         from "@/dto/user.dto";
import { UpdateUsers } from "@/types/table.types";

interface IEUserService {
  getUserById(uuid: string): Promise<UserDto | undefined>;

  getUserByUsername(person: string): Promise<UserDto | undefined>;

  getUserByEmail(email: string): Promise<UserDto | undefined>;

  searchUserByFields(search: string): Promise<UserDto[]>;

  updateUserById(uuid: string, user: UpdateUsers): Promise<UserDto | undefined>;

  deleteUserById(uuid: string | undefined): Promise<string | undefined>;
};

export default IEUserService;