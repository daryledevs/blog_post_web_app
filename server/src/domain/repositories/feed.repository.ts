import { SelectPosts } from "@/domain/types/table.types";

interface IFeedRepository {
  getTotalFeed: () => Promise<number>;

  getUserFeed: (userId: number, postListUuids: string[]) => Promise<SelectPosts[]>;

  getExploreFeed: (userId: number) => Promise<SelectPosts[]>;
};

export default IFeedRepository;