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
const validate_request_query_validation_1 = __importDefault(require("../validations/validate-request-query.validation"));
const search_history_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/search-history.repository.impl"));
const validate_uuid_body_validation_1 = __importDefault(require("../validations/validate-uuid-body.validation"));
const validate_uuid_params_validation_1 = __importDefault(require("../validations/validate-uuid-params.validation"));
const router = express_1.default.Router();
const controller = new user_controller_1.default(new user_service_impl_1.default(new user_repository_impl_1.default()), new follow_service_impl_1.default(new user_repository_impl_1.default(), new follow_repository_impl_1.default()), new search_history_service_impl_1.default(new user_repository_impl_1.default(), new search_history_repository_impl_1.default()));
// user endpoints
router
    .route("/:uuid")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .get(controller.getUserData)
    .delete(controller.deleteUser);
router
    .route("/search")
    .all((0, validate_request_query_validation_1.default)("search"))
    .get(controller.searchUsersByQuery);
// follow endpoints
router
    .route("/:uuid/follow-stats")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .get(controller.getFollowStats);
router
    .route("/:uuid/follow-lists")
    .all((0, validate_uuid_body_validation_1.default)("listsId"), (0, validate_uuid_params_validation_1.default)("uuid"))
    .post(controller.getFollowerFollowingLists);
router
    .route("/:follower_uuid/follow/:followed_uuid")
    .all((0, validate_uuid_params_validation_1.default)(["follower_uuid", "followed_uuid"]))
    .post(controller.toggleFollow);
// search endpoints
router
    .route("/:searcher_uuid/searches")
    .all((0, validate_uuid_params_validation_1.default)("searcher_uuid"))
    .get(controller.getSearchHistory);
router
    .route("/:searcher_uuid/searches/:searched_uuid")
    .all((0, validate_uuid_params_validation_1.default)(["searcher_uuid", "searched_uuid"]))
    .post(controller.saveRecentSearches);
router
    .route("/:uuid/searches")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .delete(controller.removeRecentSearches);
exports.default = router;
