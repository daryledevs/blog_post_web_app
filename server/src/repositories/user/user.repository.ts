import { SelectUsers, UpdateUsers } from "@/types/table.types";

interface IEUserRepository {
  findUserById: (uuid: string) => Promise<SelectUsers | undefined>;

  findUserByUsername: (username: string) => Promise<SelectUsers | undefined>;

  searchUsersByQuery: (search: string) => Promise<SelectUsers[]>;

  findUserByEmail: (email: string) => Promise<SelectUsers | undefined>;

  findUserByCredentials: (userCredential: string) =>  Promise<SelectUsers | undefined>;
  
  updateUserById: (uuid: string, user: UpdateUsers) => Promise<UpdateUsers>;

  deleteUserById: (uuid: string) => Promise<void>;
};

export default IEUserRepository;