import User                from "@/domain/models/user.model";
import UserDto             from "@/domain/dto/user.dto";
import AsyncWrapper        from "@/application/utils/async-wrapper.util";
import IEUserService       from "./user.service";
import { UpdateUsers }     from "@/domain/types/table.types";
import IEUserRepository    from "@/domain/repositories/user.repository";
import ApiErrorException   from "@/application/exceptions/api.exception";
import { plainToInstance } from "class-transformer";

class UserService implements IEUserService {
  private wrap: AsyncWrapper = new AsyncWrapper();
  private userRepository: IEUserRepository;

  constructor(userRepository: IEUserRepository) {
    this.userRepository = userRepository;
  }

  public getUserById = this.wrap.serviceWrap(
    async (uuid: string): Promise<UserDto | undefined> => {
      // If no parameters are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by id, return an error if the user is not found
      const user = await this.userRepository.findUserById(uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      return this.userDtoClass(user);
    }
  );

  public getUserByUsername = this.wrap.serviceWrap(
    async (username: string): Promise<UserDto | undefined> => {
      // If no parameters are provided, return an error
      if (!username)
        throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by username, return an error if the user is not found
      const user = await this.userRepository.findUserByUsername(username);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      return this.userDtoClass(user);
    }
  );

  public getUserByEmail = this.wrap.serviceWrap(
    async (email: string): Promise<UserDto | undefined> => {
      // If no parameters are provided, return an error
      if (!email) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email, return an error if the user is not found
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      return this.userDtoClass(user);
    }
  );

  public updateUserById = this.wrap.serviceWrap(
    async (uuid: string, data: UpdateUsers): Promise<UserDto | undefined> => {
      // If no parameters are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email, return an error if the user is not found
      const user = await this.userRepository.findUserById(uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      const updatedUser = await this.userRepository.updateUserById(uuid, data);
      if (!updatedUser)
        throw ApiErrorException.HTTP500Error("Failed to update user");

      return this.userDtoClass(user);
    }
  );

  public deleteUserById = this.wrap.serviceWrap(
    async (uuid: string): Promise<string | undefined> => {
      // If no parameters are provided, return an error
      if (!uuid) throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by email, return an error if the user is not found
      const user = await this.userRepository.findUserById(uuid);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      await this.userRepository.deleteUserById(uuid);
      return "User deleted successfully";
    }
  );

  public searchUserByFields = this.wrap.serviceWrap(
    async (search: string): Promise<UserDto[]> => {
      // If no parameters are provided, return an error
      if (!search)
        throw ApiErrorException.HTTP400Error("No arguments provided");

      // search the user by search query
      const searches = await this.userRepository.searchUsersByQuery(search);
      return searches.map((user) => plainToInstance(UserDto, user));
    }
  );

  private userDtoClass = (user: User | undefined): UserDto | undefined => {
    return user
      ? plainToInstance(UserDto, user, {
          excludeExtraneousValues: true,
        })
      : undefined;
  };
}

export default UserService;