import User            from "@/domain/models/user.model";
import { UpdateUsers } from "@/domain/types/table.types";

interface IUserRepository {
  findUserById: (uuid: string) => Promise<User | undefined>;

  findUserByUsername: (username: string) => Promise<User | undefined>;

  searchUsersByQuery: (search: string) => Promise<User[]>;

  findUserByEmail: (email: string) => Promise<User | undefined>;

  findUserByCredentials: (userCredential: string) => Promise<User | undefined>;

  updateUserById: (uuid: string, user: UpdateUsers) => Promise<User>;

  deleteUserById: (id: number) => Promise<void>;
};

export default IUserRepository;