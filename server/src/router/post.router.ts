import express         from "express";
import uploadImage     from "../middleware/multer";
import PostsController from "@/controller/post.controller.";

const router = express.Router();
const controller: PostsController = new PostsController();

const uploadOption = uploadImage("./uploads/post");
const option_field = [ { name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 } ];

// post
router.get("/", controller.getUserPost);
router.get("/stats", controller.getUserTotalPosts);
router.patch("/:post_id", controller.editPost);
router.post("/", uploadOption.fields(option_field), controller.newPost);
router.delete("/:post_id", controller.deletePost);

// likes
router.get("/:post_id/likes", controller.getLikesCountForPost);
router.get("/:post_id/users/:user_id/likes", controller.checkUserLikeStatusForPost);
router.put("/:post_id/users/:user_id/likes", controller.toggleUserLikeForPost);


export default router;