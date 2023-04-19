import express from "express";
import uploadImage from "../middleware/multer";
import { deletePost, editPost, getUserPost, likePost, newPost } from "../controller/post";
const router = express.Router();

const uploadOption = uploadImage("./uploads/post");
const option_field = [ { name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 } ];

router.get("/:user_id", getUserPost);
router.post("/", uploadOption.fields(option_field), newPost);
router.patch("/:post_id", editPost);
router.delete("/:post_id", deletePost);
router.post("/like-post/:post_id/:user_id", likePost);
export default router;