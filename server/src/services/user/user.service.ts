import { SelectUsers, UpdateUsers } from "@/types/table.types";

interface IEUserService {
  getUserById(uuid: string): Promise<SelectUsers | undefined>;

  getUserByUsername(person: string): Promise<SelectUsers | undefined>;

  getUserByEmail(email: string): Promise<SelectUsers | undefined>;
  
  searchUserByFields(search: string): Promise<SelectUsers[]>;

  updateUserById(uuid: string, user: UpdateUsers): Promise<UpdateUsers>;

  deleteUserById(uuid: string | undefined): Promise<string | undefined>;
};

export default IEUserService;