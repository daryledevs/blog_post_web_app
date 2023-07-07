"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controller/user");
const router = express_1.default.Router();
router.get("/", user_1.userData);
router.post("/feed", user_1.getUserFeed);
router.get("/search", user_1.findUser);
router.get("/feed/count", user_1.getTotalFeed);
router.get("/:username", user_1.findUsername);
exports.default = router;
