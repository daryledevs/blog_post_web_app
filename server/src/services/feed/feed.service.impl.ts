import IFeedService    from "./feed.service";
import ErrorException  from "@/exceptions/error.exception";
import FeedRepository  from "@/repositories/feed/feed.repository.impl";
import UserRepository  from "@/repositories/user/user.repository.impl";
import { SelectPosts } from "@/types/table.types";

class FeedService implements IFeedService {
  private feedRepository: FeedRepository;
  private userRepository: UserRepository;

  constructor(feedRepository: FeedRepository, userRepository: UserRepository) {
    this.feedRepository = feedRepository;
    this.userRepository = userRepository;
  };

  public async getTotalFeed(): Promise<number> {
    try {
      return await this.feedRepository.getTotalFeed();
    } catch (error) {
      throw error;
    };
  };

  public async getUserFeed(user_id: number, post_ids: number[]): Promise<SelectPosts[]> {
    try {
      if(!user_id) throw ErrorException.badRequest("No arguments provided");
      const isUserExists = await this.userRepository.findUserById(user_id);
      if(!isUserExists) throw ErrorException.notFound("User not found");
      return await this.feedRepository.getUserFeed(user_id, post_ids);
    } catch (error) {
      throw error;
    };
  };

  public async getExploreFeed(user_id: number): Promise<SelectPosts[]> {
    try {
      if(!user_id) throw ErrorException.badRequest("No arguments provided");
      const isUserExists = await this.userRepository.findUserById(user_id);
      if(!isUserExists) throw ErrorException.notFound("User not found");
      return await this.feedRepository.getExploreFeed(user_id);
    } catch (error) {
      throw error;
    };
  };
};

export default FeedService;