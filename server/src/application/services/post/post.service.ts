import PostDto                   from "@/domain/dto/post.dto";
import { NewPosts, UpdatePosts } from "@/domain/types/table.types";

interface IEPostService {
  getPostByUuid: (uuid: string | undefined) => Promise<PostDto | undefined>;

  getAllPostsByUsersUuid: (user_uuid: string | undefined) => Promise<PostDto[]>;

  geTotalPostsByUsersUuid: (user_uuid: string | undefined) => Promise<string | number | bigint>;

  createNewPost: (file: Express.Multer.File | null | undefined, post: NewPosts | undefined) => Promise<string>;

  updatePostByUuid: (uuid: string | undefined, post: UpdatePosts | undefined) => Promise<string | undefined>;

  deletePostByUuid: (uuid: string | undefined) => Promise<string>;
}

export default IEPostService;
