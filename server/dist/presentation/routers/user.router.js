"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_service_impl_1 = __importDefault(require("@/application/services/user/user.service.impl"));
const follow_service_impl_1 = __importDefault(require("@/application/services/follow/follow.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const user_controller_1 = __importDefault(require("@/presentation/controllers/user.controller"));
const follow_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/follow.repository.impl"));
const search_history_service_impl_1 = __importDefault(require("@/application/services/search-history/search-history.service.impl"));
const search_history_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/search-history.repository.impl"));
const router = express_1.default.Router();
const controller = new user_controller_1.default(new user_service_impl_1.default(new user_repository_impl_1.default()), new follow_service_impl_1.default(new user_repository_impl_1.default(), new follow_repository_impl_1.default()), new search_history_service_impl_1.default(new user_repository_impl_1.default(), new search_history_repository_impl_1.default()));
// user endpoints
router.get("/", controller.getUserData);
router.get("/search", controller.searchUsersByQuery);
// follow endpoints
router.get("/:uuid/follow-stats", controller.getFollowStats);
router.post("/:uuid/follow-lists", controller.getFollowerFollowingLists);
router.post("/:follower_uuid/follow/:followed_uuid", controller.toggleFollow);
// search endpoints
router.get("/:searcher_uuid/searches", controller.getSearchHistory);
router.post("/:searcher_uuid/searches/:searched_uuid", controller.saveRecentSearches);
router.delete("/:uuid/searches", controller.removeRecentSearches);
// user's account endpoints
router.delete("/:uuid", controller.deleteUser);
exports.default = router;
