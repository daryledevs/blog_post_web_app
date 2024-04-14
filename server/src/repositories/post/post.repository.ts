import { NewPosts, SelectLikes, SelectPosts, UpdatePosts } from "@/types/table.types";

interface IPostRepository {
  findPostsByPostId: (post_id: number) => Promise<SelectPosts | undefined>;
  
  getUserPosts: (user_id: number) => Promise<SelectPosts[]>;

  getUserTotalPosts: (user_id: number) => Promise<string | number | bigint>;

  newPost: (post: NewPosts) => Promise<void>;

  editPost: (post_id: number, post: UpdatePosts) => Promise<void>;

  deletePost: (post_id: number) => Promise<void>;

  getLikesCountForPost: (post_id: number) => Promise<number>;

  isUserLikePost: (like: SelectLikes) => Promise<SelectLikes | undefined>;

  toggleUserLikeForPost: (like: SelectLikes) => Promise<void>;

  removeUserLikeForPost: (like: SelectLikes) => Promise<void>;
}

export default IPostRepository;