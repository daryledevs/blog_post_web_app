"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const follow_model_1 = __importDefault(require("./follow.model"));
class Follower extends follow_model_1.default {
    follower_id;
    follower_uuid;
    constructor(follower_id, follower_uuid, created_at, username, first_name, last_name, avatar_url) {
        super(username, created_at, first_name, last_name, avatar_url);
        this.follower_id = follower_id;
        this.follower_uuid = follower_uuid;
    }
    // getters
    getFollowerId() {
        return this.follower_id;
    }
    getFollowerUuid() {
        return this.follower_uuid;
    }
    // setters
    setFollowerId(follower_id) {
        this.follower_id = follower_id;
    }
    setFollowerUuid(follower_uuid) {
        this.follower_uuid = follower_uuid;
    }
}
exports.default = Follower;
