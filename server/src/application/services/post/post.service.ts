import PostDto                   from "@/domain/dto/post.dto";
import { NewPosts, UpdatePosts } from "@/domain/types/table.types";

interface IEPostService {
  getPostByUuid: (uuid: string | undefined) => Promise<PostDto | undefined>;

  getAllPostsByUsersUuid: (user_uuid: string | undefined) => Promise<PostDto[]>;

  geTotalPostsByUsersUuid: (user_uuid: string | undefined) => Promise<string | number | bigint>;

  createNewPost: (postDto: PostDto) => Promise<string>;

  updatePostByUuid: (uuid: string | undefined, post: PostDto | undefined) => Promise<string | undefined>;

  deletePostByUuid: (uuid: string | undefined) => Promise<string>;
}

export default IEPostService;
