"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_1 = require("../controller/chat");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/get-all-chats/:user_id", chat_1.getAllChats);
router.get("/:user_id", chat_1.getAllChatMember);
router.post("/", chat_1.newConversation);
router.get("/message/:conversation_id", chat_1.getMessage);
router.post("/message", chat_1.newMessage);
exports.default = router;
