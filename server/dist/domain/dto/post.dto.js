"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class PostDto {
    id;
    uuid;
    image_id;
    image_url;
    files;
    user_id;
    user_uuid;
    caption;
    privacy_level;
    created_at;
    constructor(id, uuid, image_id, image_url, files, user_id, user_uuid, caption, privacy_level, created_at) {
        this.id = id;
        this.uuid = uuid;
        this.image_id = image_id;
        this.image_url = image_url;
        this.files = files;
        this.user_id = user_id;
        this.user_uuid = user_uuid;
        this.caption = caption;
        this.privacy_level = privacy_level;
        this.created_at = created_at;
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
    getFiles() {
        return this.files;
    }
    getUserId() {
        return this.user_id;
    }
    getUserUuid() {
        return this.user_uuid;
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
    setFiles(files) {
        this.files = files;
    }
    setUserId(user_id) {
        this.user_id = user_id;
    }
    setUserUuid(user_uuid) {
        this.user_uuid = user_uuid;
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
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, class_validator_1.ValidateIf)((o) => o.files.length === 0),
    __metadata("design:type", Number)
], PostDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ValidateIf)((o) => o.files.length === 0),
    (0, class_validator_1.IsNotEmpty)({ message: "UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid search's UUID version" }),
    __metadata("design:type", Object)
], PostDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ValidateIf)((o) => o.files.length === 0),
    (0, class_validator_1.IsNotEmpty)({ message: "image ID is required" }),
    __metadata("design:type", String)
], PostDto.prototype, "image_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ValidateIf)((o) => o.files.length === 0),
    (0, class_validator_1.IsNotEmpty)({ message: "image URL is required" }),
    __metadata("design:type", Object)
], PostDto.prototype, "image_url", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, class_validator_1.ValidateIf)((o) => !o.id || !o.uuid || !o.image_id || !o.image_url),
    (0, class_validator_1.ArrayNotEmpty)({ message: "files are required" }),
    __metadata("design:type", Array)
], PostDto.prototype, "files", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], PostDto.prototype, "user_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PostDto.prototype, "user_uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PostDto.prototype, "caption", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PostDto.prototype, "privacy_level", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], PostDto.prototype, "created_at", void 0);
exports.default = PostDto;
