import AsyncWrapper                 from "@/utils/async-wrapper.util";
import IEUserService                from "./user.service";
import IEUserRepository             from "@/repositories/user/user.repository";
import ApiErrorException            from "@/exceptions/api.exception";
import { SelectUsers, UpdateUsers } from "@/types/table.types";

class UserService implements IEUserService {
  private wrap: AsyncWrapper = new AsyncWrapper();
  private userRepository: IEUserRepository;

  constructor(userRepository: IEUserRepository) {
    this.userRepository = userRepository;
  }

  public getUserById = this.wrap.serviceWrap(
    async (uuid: string): Promise<SelectUsers | undefined> => {
      // If no parameters are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by user_id
      const data = await this.userRepository.findUserById(uuid);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");
      return data;
    }
  );

  public getUserByUsername = this.wrap.serviceWrap(
    async (username: string): Promise<SelectUsers | undefined> => {
      // If no parameters are provided, return an error
      if (!username) throw ApiErrorException.HTTP400Error("No arguments provided");

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

  public updateUserById = this.wrap.serviceWrap(
    async (uuid: string, user: UpdateUsers): Promise<UpdateUsers> => {
      // If no parameters are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(uuid);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");

      return await this.userRepository.updateUserById(uuid, user);
    }
  );

  public deleteUserById = this.wrap.serviceWrap(
    async (uuid: string): Promise<string | undefined> => {
      // If no parameters are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(uuid);

      // If the user is not found, return an error
      if (!data) throw ApiErrorException.HTTP404Error("User not found");

      await this.userRepository.deleteUserById(uuid);
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