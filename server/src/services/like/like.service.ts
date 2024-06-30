import LikeDto from "@/dto/like.dto";
import { SelectLikes } from "@/types/table.types";

interface IELikeService {
  getPostLikesCountByUuid: (uuid: string | undefined) => Promise<number>;

  getUserLikeStatusForPostByUuid: (user_uuid: string | undefined, post_uuid: string | undefined) => Promise<LikeDto | undefined>;

  toggleUserLikeForPost: (user_uuid: string | undefined, post_uuid: string | undefined) => Promise<string>;
}

export default IELikeService;
