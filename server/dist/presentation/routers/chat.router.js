"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_service_impl_1 = __importDefault(require("@/application/services/chat/chat.service.impl"));
const user_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/user.repository.impl"));
const chat_controller_1 = __importDefault(require("@/presentation/controllers/chat.controller"));
const chat_repository_impl_1 = __importDefault(require("@/infrastructure/repositories/chat.repository.impl"));
const router = express_1.default.Router();
const controller = new chat_controller_1.default(new chat_service_impl_1.default(new chat_repository_impl_1.default(), new user_repository_impl_1.default()));
router.post("/:uuid/messages", controller.getChatMessages);
router.post("/lists", controller.getChatHistory);
router.post("/", controller.newMessageAndConversation);
router.delete("/:uuid", controller.deleteConversationById);
exports.default = router;
