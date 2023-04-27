import express from "express";
import uploadImage from "../middleware/multer";
import { likePost, likeStatus, postAllLikes } from "../controller/like";
const router = express.Router();

router.get("/:post_id", postAllLikes);
router.get("/:post_id/:user_id", likeStatus);
router.post("/:post_id/:user_id", likePost);

export default router;