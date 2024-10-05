"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_details_dto_1 = __importDefault(require("./user-details.dto"));
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ChatDto extends user_details_dto_1.default {
    id;
    uuid;
    conversation_id;
    conversation_uuid;
    user_uuid;
    text_message;
    time_sent;
    constructor(id, uuid, conversation_id, conversation_uuid, user_uuid, username, text_message, time_sent, first_name, last_name, avatar_url) {
        super(username, first_name, last_name, avatar_url);
        this.id = id;
        this.uuid = uuid;
        this.conversation_id = conversation_id;
        this.conversation_uuid = conversation_uuid;
        this.user_uuid = user_uuid;
        this.text_message = text_message;
        this.time_sent = time_sent;
    }
    getChats() {
        return {
            uuid: this.uuid,
            conversationUuid: this.conversation_uuid,
            userUuid: this.user_uuid,
            textMessage: this.text_message,
            timeSent: this.time_sent,
            ...super.getUserDetails(),
        };
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
    setTextMessage(text_message) {
        this.text_message = text_message;
    }
    setTimeSent(time_sent) {
        this.time_sent = time_sent;
    }
}
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], ChatDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "follower UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid UUID" }),
    __metadata("design:type", Object)
], ChatDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], ChatDto.prototype, "conversation_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "conversation UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid UUID" }),
    __metadata("design:type", Object)
], ChatDto.prototype, "conversation_uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "user UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid UUID" }),
    __metadata("design:type", Object)
], ChatDto.prototype, "user_uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ChatDto.prototype, "text_message", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Date)
], ChatDto.prototype, "time_sent", void 0);
exports.default = ChatDto;
