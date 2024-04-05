import { SelectUsers, UpdateUsers } from "@/types/table.types";

interface IUserRepository {
  findUserById: (user_id: number) => Promise<SelectUsers | undefined>;

  findUserByUsername: (username: string) => Promise<SelectUsers | undefined>;

  searchUsersByQuery: (search: string) => Promise<SelectUsers[]>;

  findUserByEmail: (email: string) => Promise<SelectUsers | undefined>;

  findUserByCredentials: (userCredential: string) =>  Promise<SelectUsers | undefined>;
  
  updateUser: (user_id: number, user: UpdateUsers) => Promise<UpdateUsers>;

  deleteUser: (user_id: number) => Promise<void>;
};

export default IUserRepository;