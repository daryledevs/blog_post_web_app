"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Chat {
    id;
    uuid;
    conversation_id;
    conversation_uuid;
    sender_uuid;
    text_message;
    time_sent;
    constructor(id, uuid, conversation_id, conversation_uuid, sender_uuid, text_message, time_sent) {
        this.id = id;
        this.uuid = uuid;
        this.conversation_id = conversation_id;
        this.conversation_uuid = conversation_uuid;
        this.sender_uuid = sender_uuid;
        this.text_message = text_message;
        this.time_sent = time_sent;
    }
    // getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getConversationId() {
        return this.conversation_id;
    }
    getConversationUuid() {
        return this.conversation_uuid;
    }
    getSenderUuid() {
        return this.sender_uuid;
    }
    getTextMessage() {
        return this.text_message ?? null;
    }
    getTimeSent() {
        return this.time_sent;
    }
    // setters
    setId(id) {
        this.id = id;
    }
    setUuid(uuid) {
        this.uuid = uuid;
    }
    setConversationId(conversation_id) {
        this.conversation_id = conversation_id;
    }
    setConversationUuid(conversation_uuid) {
        this.conversation_uuid = conversation_uuid;
    }
    setSenderUuid(sender_uuid) {
        this.sender_uuid = sender_uuid;
    }
    setTextMessage(text_message) {
        this.text_message = text_message;
    }
    setTimeSent(time_sent) {
        this.time_sent = time_sent;
    }
}
exports.default = Chat;
