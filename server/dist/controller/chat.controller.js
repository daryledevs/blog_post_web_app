"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatsController {
    constructor(chatsService) {
        this.chatsService = chatsService;
    }
    ;
    async getChatHistory(req, res, next) {
        try {
            const user_id = req.query.user_id;
            const conversations = req.body || [0];
            const listId = conversations.length ? conversations : [0];
            const data = await this.chatsService.getChatHistory(user_id, listId);
            res.status(200).send(data);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async getChatMessages(req, res, next) {
        try {
            let conversation_id = req.params.conversation_id;
            const messages = req.body.messages || [0];
            const listId = messages.length ? messages : [0];
            const data = await this.chatsService.getChatMessages(conversation_id, listId);
            res.status(200).send({ chats: data });
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async newMessageAndConversation(req, res, next) {
        try {
            const { conversation_id, messageData } = req.body;
            const message = await this.chatsService.newMessageAndConversation(conversation_id, messageData);
            res.status(200).send({ message });
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async deleteConversation(req, res, next) {
        try {
            const { conversation_id } = req.body;
            const message = await this.chatsService.deleteConversation(conversation_id);
            res.status(200).send({ message });
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
}
;
exports.default = ChatsController;
