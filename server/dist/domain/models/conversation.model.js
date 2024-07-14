"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Conversation {
    id;
    uuid;
    created_at;
    constructor(id, uuid, created_at) {
        this.id = id;
        this.uuid = uuid;
        this.created_at = created_at || null;
    }
    // getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // setters
    setId(id) {
        this.id = id;
    }
    setUuid(uuid) {
        this.uuid = uuid;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = Conversation;
