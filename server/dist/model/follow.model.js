"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Follow {
    username;
    first_name;
    last_name;
    avatar_url;
    created_at;
    constructor(username, created_at, first_name, last_name, avatar_url) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar_url = avatar_url;
        this.created_at = created_at;
    }
    // getters
    getUsername() {
        return this.username;
    }
    getFirstName() {
        return this.first_name || null;
    }
    getLastName() {
        return this.last_name || null;
    }
    getAvatarUrl() {
        return this.avatar_url || null;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // setters
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
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = Follow;
