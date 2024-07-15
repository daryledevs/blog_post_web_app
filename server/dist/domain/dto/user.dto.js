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
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UserDto {
    id;
    uuid;
    username;
    email;
    password;
    roles;
    first_name;
    last_name;
    age;
    avatar_url;
    birthday;
    created_at;
    constructor(id, uuid, username, email, password, first_name, last_name, age, roles, avatar_url, birthday, created_at) {
        this.id = id;
        this.uuid = uuid;
        this.username = username;
        this.email = email;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.age = age;
        this.roles = roles;
        this.avatar_url = avatar_url;
        this.birthday = birthday;
        this.created_at = created_at;
    }
    // Getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
    }
    getUsername() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getRoles() {
        return this.roles;
    }
    getPassword() {
        return this.password;
    }
    getFirstName() {
        return this.first_name;
    }
    getLastName() {
        return this.last_name;
    }
    getAge() {
        return this.age;
    }
    getAvatar() {
        return this.avatar_url;
    }
    getBirthday() {
        return this.birthday;
    }
    getCreatedAt() {
        return this.created_at;
    }
    // Setters
    setId(value) {
        this.id = value;
    }
    setUuid(value) {
        this.uuid = value;
    }
    setUsername(value) {
        this.username = value;
    }
    setEmail(value) {
        this.email = value;
    }
    setPassword(value) {
        this.password = value;
    }
    setRoles(value) {
        this.roles = value;
    }
    setFirstName(value) {
        this.first_name = value;
    }
    setLastName(value) {
        this.last_name = value;
    }
    setAge(value) {
        this.age = value;
    }
    setAvatar(value) {
        this.avatar_url = value;
    }
    setBirthday(value) {
        this.birthday = value;
    }
    setCreatedAt(value) {
        this.created_at = value;
    }
}
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    __metadata("design:type", Number)
], UserDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    __metadata("design:type", String)
], UserDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.Length)(5, 30, { message: "username must be between 5 and 30 characters" }),
    __metadata("design:type", String)
], UserDto.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsEmail)({}, { message: "invalid email" }),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, class_validator_1.Length)(6, 100, { message: "password must be at least 6 characters" }),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)({ message: "Roles must be a string" }),
    (0, class_validator_1.IsIn)(["user", "admin"], { message: "invalid role" }),
    __metadata("design:type", Object)
], UserDto.prototype, "roles", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "First name must be a string" }),
    __metadata("design:type", Object)
], UserDto.prototype, "first_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Last name must be a string" }),
    __metadata("design:type", Object)
], UserDto.prototype, "last_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: "Age must be a number" }),
    __metadata("design:type", Object)
], UserDto.prototype, "age", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Avatar url must be a string" }),
    __metadata("design:type", Object)
], UserDto.prototype, "avatar_url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "Birthday must be a string" }),
    __metadata("design:type", Object)
], UserDto.prototype, "birthday", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UserDto.prototype, "created_at", void 0);
exports.default = UserDto;