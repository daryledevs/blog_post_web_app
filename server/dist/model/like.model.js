"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Like {
    id;
    uuid;
    post_id;
    user_id;
    created_at;
    constructor(id, uuid, post_id, user_id, created_at) {
        this.id = id;
        this.uuid = uuid;
        this.post_id = post_id;
        this.user_id = user_id;
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
    getUserId() {
        return this.user_id;
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
    setUserId(user_id) {
        this.user_id = user_id;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = Like;
