import express from "express";
import { followUser, getFollowers, register, userData } from "../controller/user";
import checkTkn from "../middleware/checkTkn";
const router = express.Router();

router.use(checkTkn);
router.post("/register", register);
router.get("/", userData);
router.get("/follow/:followed_id/:follower_id", followUser);
router.get("/followers/:user_id", getFollowers);
export default router;
