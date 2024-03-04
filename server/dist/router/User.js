"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
router.get("/", user_1.getUserData);
router.get("/:user_id/follows/stats", user_1.getFollowStats);
router.get("/:user_id/follows/:followed_id", user_1.toggleFollow);
router.post("/:user_id/lists", user_1.getFollowerFollowingLists);
exports.default = router;
