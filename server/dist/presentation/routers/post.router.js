"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_middleware_1 = __importDefault(require("@/presentation/middlewares/multer.middleware"));
const like_service_impl_1 = __importDefault(require("@/application/services/like/like.service.impl"));
const post_service_impl_1 = __importDefault(require("@/application/services/post/post.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const like_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/like.repository.impl"));
const post_controller_1 = __importDefault(require("@/presentation/controllers/post.controller"));
const post_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/post.repository.impl"));
const cloudinary_service_lib_1 = __importDefault(require("@/application/libs/cloudinary-service.lib"));
const router = express_1.default.Router();
const controller = new post_controller_1.default(new post_service_impl_1.default(new post_repository_impl_1.default(), new user_repository_impl_1.default(), new cloudinary_service_lib_1.default()), new like_service_impl_1.default(new like_repository_impl_1.default(), new post_repository_impl_1.default(), new user_repository_impl_1.default()));
const uploadOption = (0, multer_middleware_1.default)("./uploads/post");
const option_field = [{ name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 }];
const middleware = uploadOption.fields(option_field);
// post
router.get("/by-user/:user_uuid", controller.getUserPosts);
router.get("/by-user/:user_uuid/stats", controller.getUserTotalPosts);
router.patch("/:uuid", controller.editPost);
router.post("/", middleware, controller.newPost);
router.delete("/:uuid", controller.deletePost);
// likes
router.get("/:uuid/likes", controller.getLikesCountForPost);
router.get("/:uuid/by-user/:user_uuid/likes", controller.checkUserLikeStatusForPost);
router.put("/:uuid/by-user/:user_uuid/likes", controller.toggleUserLikeForPost);
exports.default = router;
