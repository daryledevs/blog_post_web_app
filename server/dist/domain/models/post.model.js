"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Post {
    id;
    uuid;
    image_id;
    image_url;
    user_id;
    caption;
    privacy_level;
    created_at;
    constructor(id, uuid, image_id, image_url, user_id, caption, privacy_level, created_at) {
        this.id = id;
        this.uuid = uuid;
        this.image_id = image_id;
        this.image_url = image_url;
        this.user_id = user_id;
        this.caption = caption;
        this.privacy_level = privacy_level;
        this.created_at = created_at;
    }
    save() {
        return {
            image_id: this.image_id,
            image_url: this.image_url,
            user_id: this.user_id,
            caption: this.caption,
            privacy_level: this.privacy_level,
        };
    }
    // getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getImageId() {
        return this.image_id;
    }
    getImageUrl() {
        return this.image_url;
    }
    getUserId() {
        return this.user_id;
    }
    getCaption() {
        return this.caption;
    }
    getPrivacyLevel() {
        return this.privacy_level;
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
    setImageId(image_id) {
        this.image_id = image_id;
    }
    setImageUrl(image_url) {
        this.image_url = image_url;
    }
    setUserId(user_id) {
        this.user_id = user_id;
    }
    setCaption(caption) {
        this.caption = caption;
    }
    setPrivacyLevel(privacy_level) {
        this.privacy_level = privacy_level;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = Post;
