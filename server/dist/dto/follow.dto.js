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
class FollowDto {
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
    setFollowerId(follower_id) {
        this.follower_id = follower_id;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], FollowDto.prototype, "followed_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "followed UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid UUID" }),
    __metadata("design:type", Object)
], FollowDto.prototype, "followed_uuid", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], FollowDto.prototype, "follower_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "follower UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid UUID" }),
    __metadata("design:type", Object)
], FollowDto.prototype, "follower_uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], FollowDto.prototype, "created_at", void 0);
exports.default = FollowDto;
