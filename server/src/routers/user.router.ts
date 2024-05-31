import express                 from "express";
import UsersService            from "@/services/user/user.service.impl";
import FollowService           from "@/services/follow/follow.service.impl";
import UserRepository          from "@/repositories/user/user.repository.impl";
import UsersController         from "@/controllers/user.controller";
import FollowRepository        from "@/repositories/follow/follow.repository.impl";
import SearchHistoryService    from "@/services/search-history/search-history.service.impl";
import SearchHistoryRepository from "@/repositories/search-history/search-history.repository.impl";

const router = express.Router();

const controller: UsersController = new UsersController(
  new UsersService(
    new UserRepository(),
  ),
  new FollowService(
    new UserRepository(),
    new FollowRepository(),
  ),
  new SearchHistoryService(
    new UserRepository(),
    new SearchHistoryRepository(),
  ),
);

router.get("/",                                        controller.getUserData);
router.get("/lists",                                   controller.searchUsersByQuery);
router.get("/:id/follows/stats",                       controller.getFollowStats);
router.get("/:searcher_uuid/searches",                 controller.getSearchHistory);
router.post("/:id/lists",                              controller.getFollowerFollowingLists);

router.post("/:follower_id/follows/:followed_id",      controller.toggleFollow);
router.post("/:searcher_uuid/searches/:searched_uuid", controller.saveRecentSearches);

router.delete("/searches/:uuid",                       controller.removeRecentSearches);
router.delete("/:id/",                                 controller.deleteUser);

export default router;
