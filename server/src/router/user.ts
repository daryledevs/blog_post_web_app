import express from "express";
import {
  toggleFollow,
  getUserData,
  getFollowStats,
  getFollowerFollowingLists,
} from "../controller/user";
const router = express.Router();

router.get("/", getUserData);
router.get("/:user_id/follows/stats", getFollowStats);
router.get("/:user_id/follows/:followed_id", toggleFollow);
router.post("/:user_id/lists", getFollowerFollowingLists);

export default router;
