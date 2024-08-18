import PostDto             from "@/domain/dto/post.dto";
import express             from "express";
import LikeService         from "@/application/services/like/like.service.impl";
import PostsService        from "@/application/services/post/post.service.impl";
import UserRepository      from "@/infrastructure/repositories/user.repository.impl";
import LikeRepository      from "@/infrastructure/repositories/like.repository.impl";
import PostsController     from "@/presentation/controllers/post.controller";
import PostsRepository     from "@/infrastructure/repositories/post.repository.impl";
import CloudinaryService   from "@/application/libs/cloudinary-service.lib";
import uploadImageHelper   from "../helpers/upload-image.helper";
import validateRequestData from "../validations/validate-request-data.validation";

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
router.get("/by-user/:user_uuid",                controller.getUserPosts);
router.get("/by-user/:user_uuid/stats",          controller.getUserTotalPosts);
router.patch("/", validateRequestData(PostDto),   controller.editPost);
router.post("/", uploadImageHelper, validateRequestData(PostDto), controller.newPost);
router.delete("/:uuid",                          controller.deletePost);

// likes
router.get("/:uuid/likes",                       controller.getLikesCountForPost);
router.get("/:uuid/by-user/:user_uuid/likes",    controller.checkUserLikeStatusForPost);
router.put("/:uuid/by-user/:user_uuid/likes",    controller.toggleUserLikeForPost);


export default router;