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
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "username is required" }),
    __metadata("design:type", String)
], FollowDto.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "first name must be a string" }),
    __metadata("design:type", Object)
], FollowDto.prototype, "first_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "last name must be a string" }),
    __metadata("design:type", Object)
], FollowDto.prototype, "last_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "avatar url must be a string" }),
    __metadata("design:type", Object)
], FollowDto.prototype, "avatar_url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], FollowDto.prototype, "created_at", void 0);
exports.default = FollowDto;
