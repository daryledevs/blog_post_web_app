import { SelectUsers, UpdateUsers } from "@/types/table.types";

interface IUserRepository {
  findUserById: (user_id: number) => Promise<SelectUsers | undefined>;

  findUserByUsername: (username: string) => Promise<SelectUsers | undefined>;

  searchUsersByQuery: (search: string) => Promise<SelectUsers[] | undefined>;

  findUserByEmail: (email: string) => Promise<SelectUsers | undefined>;

  findUserByCredentials: (username: string, email: string) =>  Promise<SelectUsers | undefined>;
  
  updateUser: (user_id: number, user: UpdateUsers) => Promise<SelectUsers | undefined>;

  deleteUser: (user_id: number) => Promise<string | undefined>;
};

export default IUserRepository;