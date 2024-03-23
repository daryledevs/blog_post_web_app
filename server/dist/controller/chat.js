"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserConversations = exports.newMessageAndConversation = exports.getMessage = void 0;
const exception_1 = __importDefault(require("../exception/exception"));
const chat_repository_1 = __importDefault(require("../repository/chat-repository"));
const getMessage = async (req, res, next) => {
    try {
        let conversation_id = req.params.conversation_id;
        const messages = req.body.messages || [0];
        const ids = messages.length ? messages : [0];
        const data = await chat_repository_1.default.getMessagesByConversationId(conversation_id, ids);
        if (!data.length)
            return next(exception_1.default.notFound("Messages not found"));
        res.status(200).send({ chats: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.getMessage = getMessage;
const getUserConversations = async (req, res, next) => {
    try {
        const user_id = req.query.user_id;
        const conversations = req.body || [];
        const ids = conversations.length ? conversations : [0];
        const data = await chat_repository_1.default.getUserConversationHistoryByUserId(user_id, ids);
        if (!data)
            return res.status(200).send({ list: data });
        return res.status(200).send({ list: data });
    }
    catch (error) {
        next(error);
    }
};
exports.getUserConversations = getUserConversations;
const newMessageAndConversation = async (req, res, next) => {
    try {
        const { sender_id, receiver_id, text_message } = req.body;
        let conversation_id = req.params.conversation_id;
        const data = await chat_repository_1.default.getHistoryByConversationId(conversation_id);
        if (!data) {
            conversation_id = await chat_repository_1.default.saveNewConversation({
                user_one_id: sender_id,
                user_two_id: receiver_id,
            });
        }
        const message = await chat_repository_1.default.saveNewMessage({
            conversation_id: conversation_id,
            sender_id,
            text_message,
        });
        return res.status(200).send({ message });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.newMessageAndConversation = newMessageAndConversation;
