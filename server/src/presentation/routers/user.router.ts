import express                   from "express";
import UsersService              from "@/application/services/user/user.service.impl";
import FollowService             from "@/application/services/follow/follow.service.impl";
import UserRepository            from "@/infrastructure/repositories/user.repository.impl";
import UsersController           from "@/presentation/controllers/user.controller";
import FollowRepository          from "@/infrastructure/repositories/follow.repository.impl";
import SearchHistoryService      from "@/application/services/search-history/search-history.service.impl";
import validateRequestQuery      from "../validations/validate-request-query.validation";
import SearchHistoryRepository   from "@/infrastructure/repositories/search-history.repository.impl";
import validateUUIDRequestBody   from "../validations/validate-uuid-body.validation";
import validateUUIDRequestParams from "../validations/validate-uuid-params.validation";

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
router
  .route("/:uuid")
  .all(validateUUIDRequestParams("uuid"))
  .get(controller.getUserData)
  .delete(controller.deleteUser);
  
router
  .route("/search")
  .all(validateRequestQuery("search"))
  .get(controller.searchUsersByQuery); 

// follow endpoints
router
  .route("/:uuid/follow-stats")
  .all(validateUUIDRequestParams("uuid"))
  .get(controller.getFollowStats);

router
  .route("/:uuid/follow-lists")
  .all(
    validateUUIDRequestBody("listsId"),
    validateUUIDRequestParams("uuid")
  )
  .post(controller.getFollowerFollowingLists);

router
  .route("/:follower_uuid/follow/:followed_uuid")
  .all(validateUUIDRequestParams(["follower_uuid", "followed_uuid"]))
  .post(controller.toggleFollow);

// search endpoints
router
  .route("/:searcher_uuid/searches")
  .all(validateUUIDRequestParams("searcher_uuid"))
  .get(controller.getSearchHistory);

router
  .route("/:searcher_uuid/searches/:searched_uuid")
  .all(validateUUIDRequestParams(["searcher_uuid", "searched_uuid"]))
  .post(controller.saveRecentSearches);

router
  .route("/:uuid/searches")
  .all(validateUUIDRequestParams("uuid"))
  .delete(controller.removeRecentSearches);

export default router;
