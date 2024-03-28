"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = __importDefault(require("@/controller/chat.controller"));
const router = express_1.default.Router();
const controller = new chat_controller_1.default();
router.post("/:conversation_id/messages", controller.getChatMessages);
router.post("/lists", controller.getChatHistory);
router.post("/", controller.newMessageAndConversation);
exports.default = router;
