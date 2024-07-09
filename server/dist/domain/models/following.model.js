"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const follow_model_1 = __importDefault(require("./follow.model"));
class Following extends follow_model_1.default {
    followed_id;
    followed_uuid;
    constructor(followed_id, followed_uuid, created_at, username, first_name, last_name, avatar_url) {
        super(username, created_at, first_name, last_name, avatar_url);
        this.followed_id = followed_id;
        this.followed_uuid = followed_uuid;
    }
    // getters
    getFollowedId() {
        return this.followed_id;
    }
    getFollowedUuid() {
        return this.followed_uuid;
    }
    // setters
    setFollowedId(followed_id) {
        this.followed_id = followed_id;
    }
    setFollowedUuid(followed_uuid) {
        this.followed_uuid = followed_uuid;
    }
}
exports.default = Following;
