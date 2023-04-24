import express from "express";
import { findUser, followUser, getFollowers, getUserFeed, register, userData } from "../controller/user";
import checkTkn from "../middleware/checkTkn";
const router = express.Router();

router.use(checkTkn);
router.post("/register", register);
router.get("/", userData);
router.get("/follow/:followed_id/:follower_id", followUser);
router.get("/followers/:user_id", getFollowers);
router.get("/search", findUser);
router.post("/feed/:user_id", getUserFeed);
export default router;
