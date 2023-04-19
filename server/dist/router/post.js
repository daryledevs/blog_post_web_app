"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../middleware/multer"));
const post_1 = require("../controller/post");
const router = express_1.default.Router();
const uploadOption = (0, multer_1.default)("./uploads/post");
const option_field = [{ name: "img", maxCount: 1 }, { name: "imgs", maxCount: 7 }];
router.get("/:user_id", post_1.getUserPost);
router.post("/", uploadOption.fields(option_field), post_1.newPost);
router.post("/like-post/:post_id/:user_id", post_1.likePost);
exports.default = router;
