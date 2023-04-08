"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Chat_1 = require("../controller/Chat");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/:length/:user_id", Chat_1.getAllChats);
router.post("/", Chat_1.newConversation);
router.post("/message/:conversation_id", Chat_1.getMessage);
router.post("/message", Chat_1.newMessage);
exports.default = router;
