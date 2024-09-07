import { SelectPosts } from "@/domain/types/table.types";

interface IEFeedService {
  getTotalFeed: () => Promise<number>;

  getUserFeed: (user_uuid: string, post_uuid: string[]) => Promise<SelectPosts[]>;

  getExploreFeed: (user_uuid: string) => Promise<SelectPosts[]>;
};

export default IEFeedService;