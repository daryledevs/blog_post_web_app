import User                from "@/domain/models/user.model";
import UserDto             from "@/domain/dto/user.dto";
import IEUserService       from "./user.service";
import { UpdateUsers }     from "@/domain/types/table.types";
import IEUserRepository    from "@/domain/repositories/user.repository";
import ApiErrorException   from "@/application/exceptions/api.exception";
import { plainToInstance } from "class-transformer";

class UserService implements IEUserService {
  private userRepository: IEUserRepository;

  constructor(userRepository: IEUserRepository) {
    this.userRepository = userRepository;
  }

  public getUserById = async (uuid: string): Promise<UserDto | undefined> => {
    // search the user by id, return an error if the user is not found
    const user = await this.userRepository.findUserById(uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    return this.plainToDto(user);
  };

  public getUserByUsername = async (
    username: string
  ): Promise<UserDto | undefined> => {
    // search the user by username, return an error if the user is not found
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    return this.plainToDto(user);
  };

  public getUserByEmail = async (
    email: string
  ): Promise<UserDto | undefined> => {
    // search the user by email, return an error if the user is not found
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    return this.plainToDto(user);
  };

  public updateUserById = async (
    uuid: string,
    data: UpdateUsers
  ): Promise<UserDto | undefined> => {
    // search the user by email, return an error if the user is not found
    const user = await this.userRepository.findUserById(uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    const updatedUser = await this.userRepository.updateUserById(uuid, data);
    
    if (!updatedUser) {
      throw ApiErrorException.HTTP500Error("Failed to update user");
    }
      

    return this.plainToDto(user);
  };

  public deleteUserById = async (uuid: string): Promise<string | undefined> => {
    // search the user by email, return an error if the user is not found
    const user = await this.userRepository.findUserById(uuid);
    if (!user) throw ApiErrorException.HTTP404Error("User not found");

    await this.userRepository.deleteUserById(user.getId());
    return "User deleted successfully";
  };

  public searchUserByFields = async (search: string): Promise<UserDto[]> => {
    // If no parameters are provided, return an error
    if (!search) throw ApiErrorException.HTTP400Error("No arguments provided");

    // search the user by search query
    const searches = await this.userRepository.searchUsersByQuery(search);
    return searches.map((user) => plainToInstance(UserDto, user));
  };

  private plainToDto = (user: User | undefined): UserDto | undefined => {
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  };
}

export default UserService;