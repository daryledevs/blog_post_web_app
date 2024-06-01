import { SelectPosts } from "@/types/table.types";

interface IEFeedService {
  getTotalFeed: () => Promise<number>;

  getUserFeed: (user_id: number, post_ids: number[]) => Promise<SelectPosts[]>;

  getExploreFeed: (user_id: number) => Promise<SelectPosts[]>;
};

export default IEFeedService;