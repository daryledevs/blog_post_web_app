import express from "express";
import {
  getUserData,
  searchUsersByQuery,
  toggleFollow,
  getFollowStats,
  getFollowerFollowingLists,
  getRecentSearches,
  saveRecentSearches,
  removeRecentSearches,
  deleteUser,
} from "../controller/user";
const router = express.Router();

router.get("/", getUserData);
router.get("/lists", searchUsersByQuery);
router.get("/:user_id/follows/stats", getFollowStats);
router.get("/:user_id/recent-searches", getRecentSearches);
router.post("/:user_id/lists", getFollowerFollowingLists);

router.post("/:user_id/follows/:followed_id", toggleFollow);
router.post("/:user_id/recent-searches/:searched_id", saveRecentSearches);

router.delete("/recent-searches/:recent_id", removeRecentSearches);
router.delete("/:user_id/", deleteUser);

export default router;
