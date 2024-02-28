import express from "express";
import uploadImage from "../middleware/multer";
import {
  newPost,
  getUserPost,
  getUserTotalPosts,
  editPost,
  deletePost,
  getLikesCountForPost,
  checkUserLikeStatusForPost,
  toggleUserLikeForPost,
} from "../controller/post";

const router = express.Router();

const uploadOption = uploadImage("./uploads/post");
const option_field = [ { name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 } ];

router.get("/", getUserPost);
router.get("/stats", getUserTotalPosts);
router.patch("/:post_id", editPost);
router.delete("/:post_id", deletePost);

router.get("/:post_id/likes", getLikesCountForPost);
router.get("/:post_id/users/:user_id/likes", checkUserLikeStatusForPost);
router.put("/:post_id/users/:user_id/likes", toggleUserLikeForPost);
router.post("/", uploadOption.fields(option_field), newPost);

export default router;