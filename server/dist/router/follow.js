"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const follow_1 = require("../controller/follow");
const router = express_1.default.Router();
router.get("/count/:user_id", follow_1.totalFollow);
router.get("/:followed_id/:follower_id", follow_1.followUser);
router.post("/:user_id", follow_1.getFollowers);
exports.default = router;
