import express from "express";
import {
  toggleFollow,
  getFollowLists,
  getUserData,
  getFollowStats,
} from "../controller/user";
const router = express.Router();

router.get("/", getUserData);
router.get("/:user_id/follows/stats", getFollowStats);
router.get("/:user_id/follows/:followed_id", toggleFollow);
router.post("/:user_id/follows/lists", getFollowLists);

export default router;
