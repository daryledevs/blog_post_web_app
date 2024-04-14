import IUserService                 from "./user.service";
import AsyncWrapper                 from "@/utils/async-wrapper.util";
import UserRepository               from "@/repositories/user/user.repository.impl";
import ApiErrorException            from "@/exceptions/api.exception";
import { SelectUsers, UpdateUsers } from "@/types/table.types";

class UserService implements IUserService {
  private wrap: AsyncWrapper = new AsyncWrapper();
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  public getUserById = this.wrap.serviceWrap(
    async (id: number): Promise<SelectUsers | undefined> => {
      // If no parameters are provided, return an error
      if (!id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by user_id
      const data = await this.userRepository.findUserById(id as any);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");
      return data;
    }
  );

  public getUserByUsername = this.wrap.serviceWrap(
    async (username: string): Promise<SelectUsers | undefined> => {
      // If no parameters are provided, return an error
      if (!username)
        throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by username
      const data = await this.userRepository.findUserByUsername(username);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");

      return data;
    }
  );

  public getUserByEmail = this.wrap.serviceWrap(
    async (email: string): Promise<SelectUsers | undefined> => {
      // If no parameters are provided, return an error
      if (!email) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserByEmail(email);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");

      return data;
    }
  );

  public updateUser = this.wrap.serviceWrap(
    async (id: number, user: UpdateUsers): Promise<UpdateUsers> => {
      // If no parameters are provided, return an error
      if (!id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(id);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");

      return await this.userRepository.updateUser(id, user);
    }
  );

  public deleteUserById = this.wrap.serviceWrap(
    async (id: number): Promise<string | undefined> => {
      // If no parameters are provided, return an error
      if (!id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(id);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");

      await this.userRepository.deleteUser(id);
      return "User deleted successfully";
    }
  );

  public searchUserByFields = this.wrap.serviceWrap(
    async (search: string): Promise<SelectUsers[]> => {
      // If no parameters are provided, return an error
      if (!search) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by search query
      return await this.userRepository.searchUsersByQuery(search);
    }
  );
}

export default UserService;