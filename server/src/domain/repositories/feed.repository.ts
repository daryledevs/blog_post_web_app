import { SelectPosts } from "@/domain/types/table.types";

interface IFeedRepository {
  getTotalFeed: () => Promise<number>;

  getUserFeed: (user_id: number, post_uuids: string[]) => Promise<SelectPosts[]>;

  getExploreFeed: (user_id: number) => Promise<SelectPosts[]>;
};

export default IFeedRepository;