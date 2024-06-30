import Like         from "@/model/like.model";
import { NewLikes } from "@/types/table.types";

interface IELikeRepository {
  findPostsLikeCount: (post_id: number) => Promise<number>;

  isUserLikePost: (user_id: number, post_id: number) => Promise<Like | undefined>;

  likeUsersPostById: (like: NewLikes) => Promise<void>;

  dislikeUsersPostById: (id: number) => Promise<void>;
}

export default IELikeRepository;