"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Like {
    id;
    uuid;
    post_id;
    post_uuid;
    user_id;
    user_uuid;
    created_at;
    constructor(id, uuid, post_id, post_uuid, user_id, user_uuid, created_at) {
        this.id = id;
        this.uuid = uuid;
        this.post_id = post_id;
        this.post_uuid = post_uuid;
        this.user_id = user_id;
        this.user_uuid = user_uuid;
        this.created_at = created_at;
    }
    // Getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getPostId() {
        return this.post_id;
    }
    getPostUuid() {
        return this.post_uuid;
    }
    getUserId() {
        return this.user_id;
    }
    getUserUuid() {
        return this.user_uuid;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // Setters
    setId(id) {
        this.id = id;
    }
    setUuid(uuid) {
        this.uuid = uuid;
    }
    setPostId(post_id) {
        this.post_id = post_id;
    }
    setPostUuid(post_uuid) {
        this.post_uuid = post_uuid;
    }
    setUserId(user_id) {
        this.user_id = user_id;
    }
    setUserUuid(user_uuid) {
        this.user_uuid = user_uuid;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = Like;
