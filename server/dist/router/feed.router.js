"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feed_controller_1 = __importDefault(require("@/controller/feed.controller"));
const feed_repository_impl_1 = __importDefault(require("@/repository/feed/feed.repository.impl"));
const user_repository_impl_1 = __importDefault(require("@/repository/user/user.repository.impl"));
const feed_service_impl_1 = __importDefault(require("@/service/feed/feed.service.impl"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller = new feed_controller_1.default(new feed_service_impl_1.default(new feed_repository_impl_1.default(), new user_repository_impl_1.default()));
router.get("/count", controller.getTotalFeed);
router.get("/explore", controller.getExploreFeed);
router.post("/", controller.getUserFeed);
exports.default = router;
