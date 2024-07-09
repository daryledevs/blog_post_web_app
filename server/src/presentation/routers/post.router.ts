import express           from "express";
import uploadImage       from "@/presentation/middlewares/multer.middleware";
import LikeService       from "@/application/services/like/like.service.impl";
import PostsService      from "@/application/services/post/post.service.impl";
import UserRepository    from "@/infrastructure/repositories/user.repository.impl";
import LikeRepository    from "@/infrastructure/repositories/like.repository.impl";
import PostsController   from "@/presentation/controllers/post.controller";
import PostsRepository   from "@/infrastructure/repositories/post.repository.impl";
import CloudinaryService from "@/application/libs/cloudinary-service.lib";

const router = express.Router();

const controller: PostsController = new PostsController(
  new PostsService(
    new PostsRepository(),
    new UserRepository(),
    new CloudinaryService()
  ),
  new LikeService(
    new LikeRepository(),
    new PostsRepository(),
    new UserRepository()
  )
);

const uploadOption = uploadImage("./uploads/post");
const option_field = [ { name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 } ];
const middleware = uploadOption.fields(option_field)

// post
router.get("/by-user/:user_uuid",             controller.getUserPosts);
router.get("/by-user/:user_uuid/stats",       controller.getUserTotalPosts);
router.patch("/:uuid",                        controller.editPost);
router.post("/", middleware,                  controller.newPost);
router.delete("/:uuid",                       controller.deletePost);

// likes
router.get("/:uuid/likes",                    controller.getLikesCountForPost);
router.get("/:uuid/by-user/:user_uuid/likes", controller.checkUserLikeStatusForPost);
router.put("/:uuid/by-user/:user_uuid/likes", controller.toggleUserLikeForPost);


export default router;