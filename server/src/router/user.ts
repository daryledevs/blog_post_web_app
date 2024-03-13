import express from "express";
import {
  getUserData,
  searchUsersByQuery,
  toggleFollow,
  getFollowStats,
  getFollowerFollowingLists,
  getRecentSearchUser,
} from "../controller/user";
const router = express.Router();

router.get("/", getUserData);
router.get("/lists", searchUsersByQuery);
router.get("/:user_id/follows/stats", getFollowStats);
router.get("/:user_id/recent-searches", getRecentSearchUser);
router.get("/:user_id/follows/:followed_id", toggleFollow);
router.post("/:user_id/lists", getFollowerFollowingLists);

export default router;
