import Like         from "@/domain/models/like.model";
import { NewLikes } from "@/domain/types/table.types";

interface ILikeRepository {
  findPostsLikeCount: (postId: number) => Promise<number>;

  isUserLikePost: (userId: number, postId: number) => Promise<Like | undefined>;

  likeUsersPostById: (like: NewLikes) => Promise<void>;

  dislikeUsersPostById: (id: number) => Promise<void>;
}

export default ILikeRepository;