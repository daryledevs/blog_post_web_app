import { NewPosts, SelectPosts, UpdatePosts } from "@/types/table.types";

interface IEPostRepository {
  findPostsByPostId: (uuid: string) => Promise<SelectPosts | undefined>;

  findAllPostsByUserId: (user_id: number) => Promise<SelectPosts[]>;

  findUserTotalPostsByUserId: (user_id: number) => Promise<string | number | bigint>;

  createNewPost: (post: NewPosts) => Promise<void>;

  editPostByPostId: (uuid: string, post: UpdatePosts) => Promise<void>;

  deletePostById: (post_id: number) => Promise<void>;
}

export default IEPostRepository;