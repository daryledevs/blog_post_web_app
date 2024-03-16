"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feed_1 = require("../controller/feed");
const router = express_1.default.Router();
router.get("/count", feed_1.getTotalFeed);
router.get("/explore", feed_1.getExploreFeed);
router.post("/", feed_1.getUserFeed);
exports.default = router;
