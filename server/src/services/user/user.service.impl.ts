import IUserService                 from "./user.service";
import ErrorException               from "@/exceptions/error.exception";
import UserRepository               from "@/repositories/user/user.repository.impl";
import { SelectUsers, UpdateUsers } from "@/types/table.types";

class UserService implements IUserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  };

  public async getUserById(id: number): Promise<SelectUsers | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!id) throw ErrorException.badRequest("No arguments provided");
      
      // search the user by user_id
      const data = await this.userRepository.findUserById(id as any);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");
      return data;
    } catch (error) {
      throw error;
    };
  };

  public async getUserByUsername(username: string): Promise<SelectUsers | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!username) throw ErrorException.badRequest("No arguments provided");

      // search the user by username
      const data = await this.userRepository.findUserByUsername(username);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      return data;
    } catch (error) {
      throw error;
    };
  };

  public async getUserByEmail(email: string): Promise<SelectUsers | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!email) throw ErrorException.badRequest("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserByEmail(email);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      return data;
    } catch (error) {
      throw error;
    };
  };

  public async updateUser(id: number, user: UpdateUsers): Promise<UpdateUsers> {
    try {
      // If no parameters are provided, return an error
      if (!id) throw ErrorException.badRequest("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(id);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      return await this.userRepository.updateUser(id, user);
    } catch (error) {
      throw error;
    };
  };

  public async deleteUserById(id: number): Promise<string | undefined> {
    try {
      // If no parameters are provided, return an error
      if (!id) throw ErrorException.badRequest("No arguments provided");

      // search the user by email
      const data = await this.userRepository.findUserById(id);

      // If the user is not found, return an error
      if (!data) throw ErrorException.notFound("User not found");

      await this.userRepository.deleteUser(id);
      return "User deleted successfully";
    } catch (error) {
      throw error;
    };
  };

  public async searchUserByFields(search: string): Promise<SelectUsers[]> {
    try {
      // If no parameters are provided, return an error
      if (!search) throw ErrorException.badRequest("No arguments provided");

      // search the user by search query
      return await this.userRepository.searchUsersByQuery(search);
    } catch (error) {
      throw error;
    };
  };
};

export default UserService;