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
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class ChatDto {
    id;
    uuid;
    conversation_id;
    conversation_uuid;
    user_uuid;
    username;
    first_name;
    last_name;
    avatar_url;
    constructor(id, uuid, conversation_id, conversation_uuid, user_uuid, username, first_name, last_name, avatar_url) {
        this.id = id;
        this.uuid = uuid;
        this.conversation_id = conversation_id;
        this.conversation_uuid = conversation_uuid;
        this.user_uuid = user_uuid;
        this.username = username;
        this.first_name = first_name || null;
        this.last_name = last_name || null;
        this.avatar_url = avatar_url || null;
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
    getUsername() {
        return this.username;
    }
    getFirstName() {
        return this.first_name;
    }
    getLastName() {
        return this.last_name;
    }
    getAvatarUrl() {
        return this.avatar_url;
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
    setUsername(username) {
        this.username = username;
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
    (0, class_validator_1.IsNotEmpty)({ message: "username is required" }),
    __metadata("design:type", Object)
], ChatDto.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ChatDto.prototype, "first_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ChatDto.prototype, "last_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ChatDto.prototype, "avatar_url", void 0);
exports.default = ChatDto;
