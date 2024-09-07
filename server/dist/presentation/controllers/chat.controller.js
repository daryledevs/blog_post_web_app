"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatsController {
    chatsService;
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    getChatHistory = async (req, res) => {
        const user_uuid = req.query.user_uuid;
        const emptyData = [0];
        const conversationIds = req.body.conversationIds || emptyData;
        const listId = conversationIds.length ? conversationIds : emptyData;
        const data = await this.chatsService.getChatHistory(user_uuid, listId);
        res.status(200).send({ chats: data });
    };
    getChatMessages = async (req, res) => {
        let uuid = req.params.uuid;
        const emptyData = [0];
        const messageIds = req.body.messageIds || emptyData;
        const listIds = messageIds.length ? messageIds : emptyData;
        const messages = await this.chatsService.getChatMessages(uuid, listIds);
        res.status(200).send({ messages: messages });
    };
    newMessageAndConversation = async (req, res) => {
        const body = req.body;
        const message = await this.chatsService.newMessageAndConversation(body);
        res.status(200).send({ message });
    };
    deleteConversationById = async (req, res) => {
        const uuid = req.params.uuid;
        const message = await this.chatsService.deleteConversationById(uuid);
        res.status(200).send({ message });
    };
}
;
exports.default = ChatsController;
