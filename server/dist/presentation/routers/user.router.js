"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const user_service_impl_1 = __importDefault(require("@/application/services/user/user.service.impl"));
const follow_service_impl_1 = __importDefault(require("@/application/services/follow/follow.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const user_controller_1 = __importDefault(require("@/presentation/controllers/user.controller"));
const follow_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/follow.repository.impl"));
const search_history_service_impl_1 = __importDefault(require("@/application/services/search-history/search-history.service.impl"));
const validate_request_query_validation_1 = __importDefault(require("../validations/validate-request-query.validation"));
const search_history_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/search-history.repository.impl"));
const validate_uuid_body_validation_1 = __importDefault(require("../validations/validate-uuid-body.validation"));
const validate_uuid_params_validation_1 = __importDefault(require("./../validations/validate-uuid-params.validation"));
const router = express_1.default.Router();
const wrap = new async_wrapper_util_1.default();
const controller = new user_controller_1.default(new user_service_impl_1.default(new user_repository_impl_1.default()), new follow_service_impl_1.default(new user_repository_impl_1.default(), new follow_repository_impl_1.default()), new search_history_service_impl_1.default(new user_repository_impl_1.default(), new search_history_repository_impl_1.default()));
// user endpoints
router
    .route("/")
    .get(wrap.asyncErrorHandler(controller.getUserData));
router
    .route("/:uuid")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .delete(wrap.asyncErrorHandler(controller.deleteUser));
router
    .route("/search")
    .all((0, validate_request_query_validation_1.default)("searchQuery"))
    .get(wrap.asyncErrorHandler(controller.searchUsersByQuery));
// follow endpoints
router
    .route("/:uuid/follow-stats")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .get(wrap.asyncErrorHandler(controller.getFollowStats));
router
    .route("/:uuid/follow-lists")
    .all((0, validate_uuid_params_validation_1.default)("uuid"), (0, validate_uuid_body_validation_1.default)("followListIds"), (0, validate_request_query_validation_1.default)("fetchFollowType"))
    .post(wrap.asyncErrorHandler(controller.getFollowerFollowingLists));
router
    .route("/:follower_uuid/follow/:followed_uuid")
    .all((0, validate_uuid_params_validation_1.default)(["follower_uuid", "followed_uuid"]))
    .post(wrap.asyncErrorHandler(controller.toggleFollow));
// search endpoints
router
    .route("/:searcher_uuid/searches")
    .all((0, validate_uuid_params_validation_1.default)("searcher_uuid"))
    .get(wrap.asyncErrorHandler(controller.getSearchHistory));
router
    .route("/:searcher_uuid/searches/:searched_uuid")
    .all((0, validate_uuid_params_validation_1.default)(["searcher_uuid", "searched_uuid"]))
    .post(wrap.asyncErrorHandler(controller.saveRecentSearches));
router
    .route("/:uuid/searches")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .delete(wrap.asyncErrorHandler(controller.removeRecentSearches));
exports.default = router;
