import express from "express";
import uploadImage from "../middleware/multer";
import { editPost, getUserPost, likePost, newPost } from "../controller/post";
const router = express.Router();

const uploadOption = uploadImage("./uploads/post");
const option_field = [ { name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 } ];

router.get("/:user_id", getUserPost);
router.post("/", uploadOption.fields(option_field), newPost);
router.post("/like-post/:post_id/:user_id", likePost);
router.patch("/edit-post/:post_id", editPost);
export default router;