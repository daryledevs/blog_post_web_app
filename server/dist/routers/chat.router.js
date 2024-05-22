"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_controller_1 = __importDefault(require("@/controllers/chat.controller"));
const user_repository_impl_1 = __importDefault(require("@/repositories/user/user.repository.impl"));
const chat_repository_impl_1 = __importDefault(require("@/repositories/chat/chat.repository.impl"));
const chat_service_impl_1 = __importDefault(require("@/services/chat/chat.service.impl"));
const router = express_1.default.Router();
const controller = new chat_controller_1.default(new chat_service_impl_1.default(new chat_repository_impl_1.default(), new user_repository_impl_1.default()));
router.post("/:conversation_id/messages", controller.getChatMessages);
router.post("/lists", controller.getChatHistory);
router.get("/users/:user_one_id/:user_two_id", controller.getChatHistoryByUserId);
router.post("/", controller.newMessageAndConversation);
exports.default = router;
