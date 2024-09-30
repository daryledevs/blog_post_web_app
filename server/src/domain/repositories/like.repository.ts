import Like         from "@/domain/models/like.model";
import { NewLikes } from "@/domain/types/table.types";

interface ILikeRepository {
  findPostsLikeCount: (post_id: number) => Promise<number>;

  isUserLikePost: (user_id: number, post_id: number) => Promise<Like | undefined>;

  likeUsersPostById: (like: NewLikes) => Promise<void>;

  dislikeUsersPostById: (id: number) => Promise<void>;
}

export default ILikeRepository;