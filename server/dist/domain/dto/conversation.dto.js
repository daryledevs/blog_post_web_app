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
class ConversationDto extends user_details_dto_1.default {
    id;
    uuid;
    user_uuid;
    created_at;
    constructor(id, uuid, username, created_at, first_name, last_name, avatar_url) {
        super(username, first_name, last_name, avatar_url);
        this.id = id;
        this.uuid = uuid;
        this.created_at = created_at || null;
    }
    getConversations() {
        return {
            uuid: this.uuid,
            userUuid: this.user_uuid,
            createdAt: this.created_at,
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
    getUserUuid() {
        return this.user_uuid;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // setters
    setId(id) {
        this.id = id;
    }
    setUuid(uuid) {
        this.uuid = uuid;
    }
    setUserUuid(user_uuid) {
        this.user_uuid = user_uuid;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], ConversationDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ConversationDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], ConversationDto.prototype, "created_at", void 0);
exports.default = ConversationDto;
