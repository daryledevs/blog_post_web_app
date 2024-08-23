import PostDto                    from "@/domain/dto/post.dto";
import express                    from "express";
import LikeService                from "@/application/services/like/like.service.impl";
import PostsService               from "@/application/services/post/post.service.impl";
import UserRepository             from "@/infrastructure/repositories/user.repository.impl";
import LikeRepository             from "@/infrastructure/repositories/like.repository.impl";
import PostsController            from "@/presentation/controllers/post.controller";
import PostsRepository            from "@/infrastructure/repositories/post.repository.impl";
import CloudinaryService          from "@/application/libs/cloudinary-service.lib";
import uploadImageHelper          from "../helpers/upload-image.helper";
import validateRequestData        from "../validations/validate-request-data.validation";
import validateUUIDRequestParams  from "../validations/validate-uuid-params.validation";

const router = express.Router();

const cloudinaryService = new CloudinaryService();
const postRepository = new PostsRepository(cloudinaryService);
const likeRepository = new LikeRepository();
const userRepository = new UserRepository();

const postService = new PostsService(
  postRepository,
  userRepository,
  cloudinaryService
);

const likeService = new LikeService(
  likeRepository,
  postRepository,
  userRepository
);

const controller: PostsController = new PostsController(
  postService,
  likeService
);

// post
router
  .route("/by-user/:user_uuid")
  .get(validateUUIDRequestParams("user_uuid"), controller.getUserPosts);

router
  .route("/by-user/:user_uuid/stats")
  .get(validateUUIDRequestParams("user_uuid"), controller.getUserTotalPosts);

router
  .route("/")
  .all(uploadImageHelper, validateRequestData(PostDto))
  .post(controller.newPost)
  .patch(controller.editPost);

router
  .route("/:uuid")
  .all(validateUUIDRequestParams("uuid"))
  .get(controller.getPostByUuid)
  .delete(controller.deletePost);

// likes
router
  .route("/:uuid/likes")
  .get(validateUUIDRequestParams("uuid"), controller.getLikesCountForPost);

router
  .route("/:uuid/by-user/:user_uuid/likes")
  .all(validateUUIDRequestParams(["uuid", "user_uuid"]))
  .get(controller.checkUserLikeStatusForPost)
  .put(controller.toggleUserLikeForPost);

export default router;
