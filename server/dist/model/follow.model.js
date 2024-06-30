"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Follow {
    followed_id;
    followed_uuid;
    follower_id;
    follower_uuid;
    created_at;
    constructor(followed_id, followed_uuid, follower_id, follower_uuid, created_at) {
        this.followed_id = followed_id;
        this.followed_uuid = followed_uuid;
        this.follower_id = follower_id;
        this.follower_uuid = follower_uuid;
        this.created_at = created_at;
    }
    // getters
    getFollowedId() {
        return this.followed_id;
    }
    getFollowedUuid() {
        return this.followed_uuid;
    }
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
    setFollowedId(followed_id) {
        this.followed_id = followed_id;
    }
    setFollowedUuid(followed_uuid) {
        this.followed_uuid = followed_uuid;
    }
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
exports.default = Follow;
