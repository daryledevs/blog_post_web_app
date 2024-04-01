import express                  from "express";
import UsersService             from "@/services/user/user.service.impl";
import UserRepository           from "@/repositories/user/user.repository.impl";
import UsersController          from "@/controllers/user.controller";
import FollowRepository         from "@/repositories/follow/follow.repository.impl";
import RecentSearchesRepository from "@/repositories/recent-search/recent-search.repository.impl";

const router = express.Router();

const controller: UsersController = new UsersController(
  new UsersService(
    new UserRepository(),
    new FollowRepository(),
    new RecentSearchesRepository(),
  )
);

router.get("/",                                       controller.getUserData);
router.get("/lists",                                  controller.searchUsersByQuery);
router.get("/:user_id/follows/stats",                 controller.getFollowStats);
router.get("/:user_id/recent-searches",               controller.getRecentSearches);
router.post("/:user_id/lists",                        controller.getFollowerFollowingLists);

router.post("/:user_id/follows/:followed_id",         controller.toggleFollow);
router.post("/:user_id/recent-searches/:searched_id", controller.saveRecentSearches);

router.delete("/recent-searches/:recent_id",          controller.removeRecentSearches);
router.delete("/:user_id/",                           controller.deleteUser);

export default router;
