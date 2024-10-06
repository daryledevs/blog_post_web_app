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
class UserDetailsDto {
    username;
    first_name;
    last_name;
    avatar_url;
    age;
    birthday;
    constructor(username, first_name, last_name, avatar_url, age, birthday) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar_url = avatar_url;
        this.age = age;
        this.birthday = birthday;
    }
    getUserDetails() {
        return {
            username: this.username,
            firstName: this.first_name,
            lastName: this.last_name,
            avatarUrl: this.avatar_url,
            age: this.age,
            birthday: this.birthday,
        };
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
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsNotEmpty)({ message: "username is required" }),
    (0, class_validator_1.IsString)({ message: "username must be a string" }),
    __metadata("design:type", String)
], UserDetailsDto.prototype, "username", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "first name must be a string" }),
    __metadata("design:type", Object)
], UserDetailsDto.prototype, "first_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "last name must be a string" }),
    __metadata("design:type", Object)
], UserDetailsDto.prototype, "last_name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: "avatar url must be a string" }),
    __metadata("design:type", Object)
], UserDetailsDto.prototype, "avatar_url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({
        allowNaN: false,
        allowInfinity: false,
        maxDecimalPlaces: 1,
    }, { message: "age must be a number" }),
    __metadata("design:type", Object)
], UserDetailsDto.prototype, "age", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.MaxDate)(() => new Date(), {
        message: () => `maximal allowed date for date of birth is ${new Date().toDateString()}`,
    }),
    __metadata("design:type", Object)
], UserDetailsDto.prototype, "birthday", void 0);
exports.default = UserDetailsDto;
