"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_details_model_1 = __importDefault(require("./user-details.model"));
class Conversation extends user_details_model_1.default {
    id;
    uuid;
    user_uuid;
    created_at;
    constructor(id, uuid, user_uuid, username, first_name, last_name, avatar_url, created_at) {
        super(username, first_name, last_name, avatar_url);
        this.id = id;
        this.uuid = uuid;
        this.user_uuid = user_uuid;
        this.created_at = created_at || null;
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
exports.default = Conversation;
