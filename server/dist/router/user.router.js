"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const controller = new user_controller_1.default();
const router = express_1.default.Router();
router.get("/", controller.getUserData);
router.get("/lists", controller.searchUsersByQuery);
router.get("/:user_id/follows/stats", controller.getFollowStats);
router.get("/:user_id/recent-searches", controller.getRecentSearches);
router.post("/:user_id/lists", controller.getFollowerFollowingLists);
router.post("/:user_id/follows/:followed_id", controller.toggleFollow);
router.post("/:user_id/recent-searches/:searched_id", controller.saveRecentSearches);
router.delete("/recent-searches/:recent_id", controller.removeRecentSearches);
router.delete("/:user_id/", controller.deleteUser);
exports.default = router;
