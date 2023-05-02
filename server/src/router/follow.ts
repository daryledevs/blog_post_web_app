import express from "express";
import { followUser, getFollowers, totalFollow } from "../controller/follow";
const router = express.Router();

router.get("/count/:user_id", totalFollow);
router.get("/:followed_id/:follower_id", followUser);
router.post("/:user_id", getFollowers);

export default router;