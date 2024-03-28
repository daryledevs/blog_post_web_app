"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("@/middleware/multer"));
const post_service_impl_1 = __importDefault(require("@/service/post/post.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/repository/user/user.repository.impl"));
const post_controller_1 = __importDefault(require("@/controller/post.controller"));
const post_repository_impl_1 = __importDefault(require("@/repository/post/post.repository.impl"));
const router = express_1.default.Router();
const controller = new post_controller_1.default(new post_service_impl_1.default(new post_repository_impl_1.default(), new user_repository_impl_1.default()));
const uploadOption = (0, multer_1.default)("./uploads/post");
const option_field = [{ name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 }];
const middleware = uploadOption.fields(option_field);
// post
router.get("/", controller.getUserPost);
router.get("/stats", controller.getUserTotalPosts);
router.patch("/:post_id", controller.editPost);
router.post("/", middleware, controller.newPost);
router.delete("/:post_id", controller.deletePost);
// likes
router.get("/:post_id/likes", controller.getLikesCountForPost);
router.get("/:post_id/users/:user_id/likes", controller.checkUserLikeStatusForPost);
router.put("/:post_id/users/:user_id/likes", controller.toggleUserLikeForPost);
exports.default = router;
