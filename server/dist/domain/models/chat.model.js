"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Chat {
    id;
    uuid;
    user_uuid;
    username;
    first_name;
    last_name;
    avatar_url;
    constructor(id, uuid, user_uuid, username, first_name, last_name, avatar_url) {
        this.id = id;
        this.uuid = uuid;
        this.user_uuid = user_uuid;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar_url = avatar_url;
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
    getUsername() {
        return this.username;
    }
    getFirstName() {
        return this.first_name;
    }
    getLastName() {
        return this.last_name;
    }
    getAvatarUrl() {
        return this.avatar_url;
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
}
exports.default = Chat;
