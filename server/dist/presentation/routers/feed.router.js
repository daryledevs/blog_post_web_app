"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feed_service_impl_1 = __importDefault(require("@/application/services/feed/feed.service.impl"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
const feed_controller_1 = __importDefault(require("@/presentation/controllers/feed.controller"));
const feed_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/feed.repository.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const router = express_1.default.Router();
const wrap = new async_wrapper_util_1.default();
const controller = new feed_controller_1.default(new feed_service_impl_1.default(new feed_repository_impl_1.default(), new user_repository_impl_1.default()));
router
    .route("/count")
    .get(wrap.asyncErrorHandler(controller.getTotalFeed));
router
    .route("/explore")
    .get(wrap.asyncErrorHandler(controller.getExploreFeed));
router
    .route("/")
    .post(wrap.asyncErrorHandler(controller.getUserFeed));
exports.default = router;
