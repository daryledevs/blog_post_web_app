"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_details_model_1 = __importDefault(require("./user-details.model"));
class Chat extends user_details_model_1.default {
    id;
    uuid;
    conversation_id;
    conversation_uuid;
    user_uuid;
    constructor(id, uuid, conversation_id, conversation_uuid, user_uuid, username, first_name, last_name, avatar_url, age, birthday) {
        super(username, first_name, last_name, avatar_url, age, birthday);
        this.id = id;
        this.uuid = uuid;
        this.conversation_id = conversation_id;
        this.conversation_uuid = conversation_uuid;
        this.user_uuid = user_uuid;
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
    getUserUuid() {
        return this.user_uuid;
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
    setUserUuid(user_uuid) {
        this.user_uuid = user_uuid;
    }
    setFirstName(first_name) {
        this.first_name = first_name;
    }
    setLastName(last_name) {
        this.last_name = last_name;
    }
    setAvatarUrl(avatar_url) {
        this.avatar_url = avatar_url;
    }
}
exports.default = Chat;
