import express from "express";
import uploadImage from "../middleware/multer";
import { newPost } from "../controller/post";
const router = express.Router();

const uploadOption = uploadImage("./uploads/post");
const option_field = [ { name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 } ];

router.post("/new-post", uploadOption.fields(option_field), newPost);

export default router;