import AsyncWrapper      from "@/utils/async-wrapper.util";
import IEFeedService     from "./feed.service";
import IEFeedRepository  from "@/repositories/feed/feed.repository";
import IEUserRepository  from "@/repositories/user/user.repository";
import { SelectPosts }   from "@/types/table.types";
import ApiErrorException from "@/exceptions/api.exception";

class FeedService implements IEFeedService {
  private feedRepository: IEFeedRepository;
  private userRepository: IEUserRepository;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(
    feedRepository: IEFeedRepository,
    userRepository: IEUserRepository
  ) {
    this.feedRepository = feedRepository;
    this.userRepository = userRepository;
  };

  public getTotalFeed = this.wrap.serviceWrap(async (): Promise<number> => {
    return await this.feedRepository.getTotalFeed();
  });

  public getUserFeed = this.wrap.serviceWrap(
    async (user_id: string, post_ids: string[]): Promise<SelectPosts[]> => {
      // If no arguments are provided, return an error
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(user_id);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // Return the user feed
      return await this.feedRepository.getUserFeed(user.id, post_ids);
    }
  );

  public getExploreFeed = this.wrap.serviceWrap(
    async (user_id: string): Promise<SelectPosts[]> => {
      // If no arguments are provided, return an error
      if (!user_id) throw ApiErrorException.HTTP400Error("No arguments provided");

      // If the user is not found, return an error
      const user = await this.userRepository.findUserById(user_id);
      if (!user) throw ApiErrorException.HTTP404Error("User not found");

      // Return the explore feed
      return await this.feedRepository.getExploreFeed(user.id);
    }
  );
};

export default FeedService;