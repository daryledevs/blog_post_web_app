"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SearchHistory {
    id;
    uuid;
    searcher_id;
    searched_id;
    user_uuid;
    username;
    first_name;
    last_name;
    avatar_url;
    created_at;
    constructor(id, uuid, searcher_id, searched_id, user_uuid, username, created_at, first_name, last_name, avatar_url) {
        this.id = id;
        this.uuid = uuid;
        this.searcher_id = searcher_id;
        this.searched_id = searched_id;
        this.user_uuid = user_uuid;
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar_url = avatar_url;
        this.created_at = created_at;
    }
    save() {
        return {
            searcher_id: this.searcher_id,
            searched_id: this.searched_id,
        };
    }
    // Getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getSearcherId() {
        return this.searcher_id;
    }
    getSearchedId() {
        return this.searched_id;
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
    getAvatar() {
        return this.avatar_url;
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
    setSearcherId(searcher_id) {
        this.searcher_id = searcher_id;
    }
    setSearchedId(searched_id) {
        this.searched_id = searched_id;
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
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = SearchHistory;
