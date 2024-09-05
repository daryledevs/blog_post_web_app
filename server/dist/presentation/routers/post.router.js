"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_dto_1 = __importDefault(require("@/domain/dto/post.dto"));
const express_1 = __importDefault(require("express"));
const like_service_impl_1 = __importDefault(require("@/application/services/like/like.service.impl"));
const post_service_impl_1 = __importDefault(require("@/application/services/post/post.service.impl"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const like_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/like.repository.impl"));
const post_controller_1 = __importDefault(require("@/presentation/controllers/post.controller"));
const post_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/post.repository.impl"));
const cloudinary_service_lib_1 = __importDefault(require("@/application/libs/cloudinary-service.lib"));
const upload_image_helper_1 = __importDefault(require("../helpers/upload-image.helper"));
const validate_request_data_validation_1 = __importDefault(require("../validations/validate-request-data.validation"));
const validate_uuid_params_validation_1 = __importDefault(require("../validations/validate-uuid-params.validation"));
const router = express_1.default.Router();
const wrap = new async_wrapper_util_1.default();
const cloudinaryService = new cloudinary_service_lib_1.default();
const postRepository = new post_repository_impl_1.default(cloudinaryService);
const likeRepository = new like_repository_impl_1.default();
const userRepository = new user_repository_impl_1.default();
const postService = new post_service_impl_1.default(postRepository, userRepository, cloudinaryService);
const likeService = new like_service_impl_1.default(likeRepository, postRepository, userRepository);
const controller = new post_controller_1.default(postService, likeService);
// post
router
    .route("/by-user/:user_uuid")
    .all((0, validate_uuid_params_validation_1.default)("user_uuid"))
    .get(wrap.asyncErrorHandler(controller.getUserPosts));
router
    .route("/by-user/:user_uuid/stats")
    .all((0, validate_uuid_params_validation_1.default)("user_uuid"))
    .get(wrap.asyncErrorHandler(controller.getUserTotalPosts));
router
    .route("/")
    .all(upload_image_helper_1.default, (0, validate_request_data_validation_1.default)(post_dto_1.default))
    .post(wrap.asyncErrorHandler(controller.newPost))
    .patch(wrap.asyncErrorHandler(controller.editPost));
router
    .route("/:uuid")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .get(wrap.asyncErrorHandler(controller.getPostByUuid))
    .delete(wrap.asyncErrorHandler(controller.deletePost));
// likes
router
    .route("/:uuid/likes")
    .all((0, validate_uuid_params_validation_1.default)("uuid"))
    .get(wrap.asyncErrorHandler(controller.getLikesCountForPost));
router
    .route("/:uuid/by-user/:user_uuid/likes")
    .all((0, validate_uuid_params_validation_1.default)(["uuid", "user_uuid"]))
    .get(wrap.asyncErrorHandler(controller.checkUserLikeStatusForPost))
    .put(wrap.asyncErrorHandler(controller.toggleUserLikeForPost));
exports.default = router;
