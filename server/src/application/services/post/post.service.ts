import PostDto                   from "@/domain/dto/post.dto";
import { NewPosts, UpdatePosts } from "@/domain/types/table.types";

interface IEPostService {
  getPostByUuid: (uuid: string) => Promise<PostDto | undefined>;

  getAllPostsByUsersUuid: (user_uuid: string) => Promise<PostDto[]>;

  geTotalPostsByUsersUuid: (user_uuid: string) => Promise<string | number | bigint>;

  createNewPost: (postDto: PostDto) => Promise<string>;

  updatePostByUuid: (post: PostDto) => Promise<string | undefined>;

  deletePostByUuid: (uuid: string) => Promise<string>;
}

export default IEPostService;
