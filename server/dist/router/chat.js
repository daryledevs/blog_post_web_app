"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = require("../controller/chat");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/:conversation_id/messages", chat_1.getMessage);
router.post("/lists", chat_1.getUserConversations);
router.post("/", chat_1.newMessageAndConversation);
exports.default = router;
