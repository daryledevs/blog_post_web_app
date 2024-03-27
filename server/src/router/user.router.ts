import express         from "express";
import UsersController from "@/controller/user.controller";

const controller: UsersController = new UsersController();
const router = express.Router();

router.get("/", controller.getUserData);
router.get("/lists", controller.searchUsersByQuery);
router.get("/:user_id/follows/stats", controller.getFollowStats);
router.get("/:user_id/recent-searches", controller.getRecentSearches);
router.post("/:user_id/lists", controller.getFollowerFollowingLists);

router.post("/:user_id/follows/:followed_id", controller.toggleFollow);
router.post("/:user_id/recent-searches/:searched_id", controller.saveRecentSearches);

router.delete("/recent-searches/:recent_id", controller.removeRecentSearches);
router.delete("/:user_id/", controller.deleteUser);

export default router;
