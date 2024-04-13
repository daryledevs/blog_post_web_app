import AsyncWrapper      from "@/utils/async-wrapper.util";
import IFeedService      from "./feed.service";
import FeedRepository    from "@/repositories/feed/feed.repository.impl";
import UserRepository    from "@/repositories/user/user.repository.impl";
import { SelectPosts }   from "@/types/table.types";
import ApiErrorException from "@/exceptions/api.exception";

class FeedService implements IFeedService {
  private feedRepository: FeedRepository;
  private userRepository: UserRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(feedRepository: FeedRepository, userRepository: UserRepository) {
    this.feedRepository = feedRepository;
    this.userRepository = userRepository;
  }

  public getTotalFeed = this.wrap.asyncWrap(async (): Promise<number> => {
    return await this.feedRepository.getTotalFeed();
  });

  public getUserFeed = this.wrap.asyncWrap(
    async (user_id: number, post_ids: number[]): Promise<SelectPosts[]> => {
      // If no arguments are provided, return an error
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isUserExists = await this.userRepository.findUserById(user_id);
      if (!isUserExists) throw ApiErrorException.HTTP404Error("User not found");

      // Return the user feed
      return await this.feedRepository.getUserFeed(user_id, post_ids);
    }
  );

  public getExploreFeed = this.wrap.asyncWrap(
    async (user_id: number): Promise<SelectPosts[]> => {
      // If no arguments are provided, return an error
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const isUserExists = await this.userRepository.findUserById(user_id);
      if (!isUserExists) throw ApiErrorException.HTTP404Error("User not found");

      // Return the explore feed
      return await this.feedRepository.getExploreFeed(user_id);
    }
  );
};

export default FeedService;