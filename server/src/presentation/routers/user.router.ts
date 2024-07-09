import express                 from "express";
import UsersService            from "@/application/services/user/user.service.impl";
import FollowService           from "@/application/services/follow/follow.service.impl";
import UserRepository          from "@/infrastructure/repositories/user.repository.impl";
import UsersController         from "@/presentation/controllers/user.controller";
import FollowRepository        from "@/infrastructure/repositories/follow.repository.impl";
import SearchHistoryService    from "@/application/services/search-history/search-history.service.impl";
import SearchHistoryRepository from "@/infrastructure/repositories/search-history.repository.impl";

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

// user endpoints
router.get("/",                                        controller.getUserData); 
router.get("/search",                                  controller.searchUsersByQuery); 

// follow endpoints
router.get("/:uuid/follow-stats",                      controller.getFollowStats);
router.post("/:uuid/follow-lists",                     controller.getFollowerFollowingLists); 
router.post("/:follower_uuid/follow/:followed_uuid",   controller.toggleFollow); 

// search endpoints
router.get("/:searcher_uuid/searches",                 controller.getSearchHistory); 
router.post("/:searcher_uuid/searches/:searched_uuid", controller.saveRecentSearches); 
router.delete("/:uuid/searches",                       controller.removeRecentSearches); 

// user's account endpoints
router.delete("/:uuid",                                controller.deleteUser); 

export default router;
