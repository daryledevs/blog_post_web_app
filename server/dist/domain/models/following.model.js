"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_details_model_1 = __importDefault(require("./user-details.model"));
class Following extends user_details_model_1.default {
    followed_id;
    followed_uuid;
    created_at;
    constructor(followed_id, followed_uuid, created_at, username, first_name, last_name, avatar_url) {
        super(username, first_name, last_name, avatar_url);
        this.followed_id = followed_id;
        this.followed_uuid = followed_uuid;
        this.created_at = created_at;
    }
    // getters
    getFollowedId() {
        return this.followed_id;
    }
    getFollowedUuid() {
        return this.followed_uuid;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // setters
    setFollowedId(followed_id) {
        this.followed_id = followed_id;
    }
    setFollowedUuid(followed_uuid) {
        this.followed_uuid = followed_uuid;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = Following;
