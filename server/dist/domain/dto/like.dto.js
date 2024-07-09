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
class LikeDto {
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
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], LikeDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid search's UUID version" }),
    __metadata("design:type", Object)
], LikeDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], LikeDto.prototype, "post_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "post's UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid search's UUID version" }),
    __metadata("design:type", Object)
], LikeDto.prototype, "post_uuid", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], LikeDto.prototype, "user_id", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, class_validator_1.IsNotEmpty)({ message: "user's UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid search's UUID version" }),
    __metadata("design:type", Object)
], LikeDto.prototype, "user_uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], LikeDto.prototype, "created_at", void 0);
exports.default = LikeDto;
