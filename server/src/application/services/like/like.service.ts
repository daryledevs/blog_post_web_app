import LikeDto from "@/domain/dto/like.dto";
import { SelectLikes } from "@/domain/types/table.types";

interface IELikeService {
  getPostLikesCountByUuid: (uuid: string) => Promise<number>;

  getUserLikeStatusForPostByUuid: (user_uuid: string, post_uuid: string) => Promise<LikeDto | undefined>;

  toggleUserLikeForPost: (user_uuid: string, post_uuid: string) => Promise<string>;
}

export default IELikeService;
