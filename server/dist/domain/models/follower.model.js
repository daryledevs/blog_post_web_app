"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_details_model_1 = __importDefault(require("./user-details.model"));
class Follower extends user_details_model_1.default {
    follower_id;
    follower_uuid;
    created_at;
    constructor(follower_id, follower_uuid, created_at, username, first_name, last_name, avatar_url) {
        super(username, first_name, last_name, avatar_url);
        this.follower_id = follower_id;
        this.follower_uuid = follower_uuid;
        this.created_at = created_at;
    }
    // getters
    getFollowerId() {
        return this.follower_id;
    }
    getFollowerUuid() {
        return this.follower_uuid;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // setters
    setFollowerId(follower_id) {
        this.follower_id = follower_id;
    }
    setFollowerUuid(follower_uuid) {
        this.follower_uuid = follower_uuid;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = Follower;
