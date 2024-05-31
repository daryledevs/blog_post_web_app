"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
class ChatsController {
    chatsService;
    wrap = new async_wrapper_util_1.default();
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    getChatHistory = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.query.user_id;
        const conversations = req.body.conversations || [0];
        const listId = conversations.length ? conversations : [0];
        const data = await this.chatsService.getChatHistory(user_id, listId);
        res.status(200).send({ chats: data });
    });
    getChatMessages = this.wrap.apiWrap(async (req, res, next) => {
        let uuid = req.params.uuid;
        const messages = req.body.messages || [0];
        const listId = messages.length ? messages : [0];
        const data = await this.chatsService.getChatMessages(uuid, listId);
        res.status(200).send({ messages: data });
    });
    newMessageAndConversation = this.wrap.apiWrap(async (req, res, next) => {
        const { cookieOptions, user_id, roles, ...rest } = req.body;
        const message = await this.chatsService.newMessageAndConversation(rest);
        res.status(200).send({ message });
    });
    deleteConversationById = this.wrap.apiWrap(async (req, res, next) => {
        const uuid = req.params.uuid;
        const message = await this.chatsService.deleteConversationById(uuid);
        res.status(200).send({ message });
    });
}
;
exports.default = ChatsController;
