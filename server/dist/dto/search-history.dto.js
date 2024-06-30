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
class SearchHistoryDto {
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
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], SearchHistoryDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "UUID is required" }),
    (0, class_validator_1.IsUUID)(4, { message: "invalid search's UUID version" }),
    __metadata("design:type", Object)
], SearchHistoryDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], SearchHistoryDto.prototype, "searcher_id", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], SearchHistoryDto.prototype, "searched_id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsUUID)(4, { message: "invalid user's UUID version" }),
    __metadata("design:type", String)
], SearchHistoryDto.prototype, "user_uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "username is required" }),
    (0, class_validator_1.IsString)({ message: "username must be a string" }),
    __metadata("design:type", String)
], SearchHistoryDto.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], SearchHistoryDto.prototype, "first_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], SearchHistoryDto.prototype, "last_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", Object)
], SearchHistoryDto.prototype, "avatar_url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)({ message: "Created at must be a valid date" }),
    __metadata("design:type", Object)
], SearchHistoryDto.prototype, "created_at", void 0);
exports.default = SearchHistoryDto;
