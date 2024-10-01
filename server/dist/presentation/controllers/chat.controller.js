"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatsController {
    chatsService;
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    getChatHistory = async (req, res) => {
        const userUuid = req.params.userUuid;
        const emptyData = [0];
        const conversationIds = req.body.conversationIds || emptyData;
        const conversationListId = conversationIds.length ? conversationIds : emptyData;
        const conversations = await this.chatsService.getChatHistory(userUuid, conversationListId);
        const conversationList = conversations.map((conversation) => conversation.getConversations());
        res.status(200).send({ conversations: conversationList });
    };
    getChatMessages = async (req, res) => {
        let uuid = req.params.uuid;
        const emptyData = [0];
        const messageIds = req.body.messageIds || emptyData;
        const messageListIds = messageIds.length ? messageIds : emptyData;
        const messages = await this.chatsService.getChatMessages(uuid, messageListIds);
        const messageList = messages.map((message) => message.getChats());
        res.status(200).send({ messages: messageList });
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
