"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
router.get("/", user_1.getUserData);
router.get("/lists", user_1.searchUsersByQuery);
router.get("/:user_id/follows/stats", user_1.getFollowStats);
router.get("/:user_id/recent-searches", user_1.getRecentSearches);
router.post("/:user_id/lists", user_1.getFollowerFollowingLists);
router.post("/:user_id/follows/:followed_id", user_1.toggleFollow);
router.post("/:user_id/recent-searches/:searched_id", user_1.saveRecentSearches);
router.delete("/recent-searches/:recent_id", user_1.removeRecentSearches);
exports.default = router;
