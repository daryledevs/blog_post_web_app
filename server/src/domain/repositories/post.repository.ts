import Post                      from "@/domain/models/post.model";
import { NewPosts, UpdatePosts } from "@/domain/types/table.types";

interface IEPostRepository {
  findPostsByPostId: (uuid: string) => Promise<Post | undefined>;

  findAllPostsByUserId: (user_id: number) => Promise<Post[]>;

  findUserTotalPostsByUserId: (user_id: number) => Promise<string | number | bigint>;

  createNewPost: (post: NewPosts) => Promise<void>;

  editPostByPostId: (uuid: string, post: UpdatePosts) => Promise<void>;

  deletePostById: (post_id: number) => Promise<void>;
}

export default IEPostRepository;