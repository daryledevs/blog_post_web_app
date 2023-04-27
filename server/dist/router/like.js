"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const like_1 = require("../controller/like");
const router = express_1.default.Router();
router.get("/:post_id", like_1.postAllLikes);
router.get("/:post_id/:user_id", like_1.likeStatus);
router.post("/:post_id/:user_id", like_1.likePost);
exports.default = router;
