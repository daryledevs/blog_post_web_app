import { NewPosts, SelectLikes, SelectPosts, UpdatePosts } from "@/types/table.types";

interface IPostsService {
  findPostsByPostId: (post_id: number) => Promise<SelectPosts | undefined>;

  getUserPosts: (user_id: number) => Promise<SelectPosts[]>;

  getUserTotalPosts: (user_id: number) => Promise<string | number | bigint>;

  newPost: (file: Express.Multer.File, post: NewPosts) => Promise<string>;

  editPost: (post_id: number, post: UpdatePosts) => Promise<string | undefined>;

  deletePost: (post_id: number) => Promise<string>;

  getLikesCountForPost: (post_id: number) => Promise<number>;

  checkUserLikeStatusForPost: (like: SelectLikes) => Promise<SelectLikes | undefined>;

  toggleUserLikeForPost: (like: SelectLikes) => Promise<string>;
};

export default IPostsService;