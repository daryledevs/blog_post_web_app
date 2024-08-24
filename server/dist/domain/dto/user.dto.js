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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
const validate_password_match_validation_1 = __importDefault(require("@/presentation/validations/validate-password-match.validation"));
const user_details_dto_1 = __importDefault(require("./user-details.dto"));
const class_transformer_1 = require("class-transformer");
class UserDto extends user_details_dto_1.default {
    id;
    uuid;
    email;
    password;
    confirmPassword;
    roles;
    created_at;
    constructor(id, uuid, username, email, password, first_name, last_name, age, roles, avatar_url, birthday, created_at, confirmPassword) {
        super(username, first_name, last_name, avatar_url, age, birthday);
        this.id = id;
        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.created_at = created_at;
        this.confirmPassword = confirmPassword;
    }
    // Getters
    getId() {
        return this.id;
    }
    getUuid() {
        return this.uuid;
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
    getConfirmPassword() {
        return this.confirmPassword;
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
    setConfirmPassword(value) {
        this.confirmPassword = value;
    }
    setRoles(value) {
        this.roles = value;
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
    (0, class_transformer_1.Expose)({ toClassOnly: true }),
    __metadata("design:type", String)
], UserDto.prototype, "uuid", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.ValidateIf)((o) => o.uuid === undefined || o.uuid === null || o.uuid === ""),
    (0, class_validator_1.IsEmail)({}, { message: "invalid email" }),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, class_validator_1.ValidateIf)((o) => o.password),
    (0, class_validator_1.IsStrongPassword)({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
    }, { message: "Password too weak" }),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, class_validator_1.ValidateIf)((o) => o.password),
    (0, class_validator_1.Validate)(validate_password_match_validation_1.default, ["password"]),
    __metadata("design:type", Object)
], UserDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsString)({ message: "Roles must be a string" }),
    (0, class_validator_1.IsIn)(["user", "admin"], { message: "invalid role" }),
    __metadata("design:type", Object)
], UserDto.prototype, "roles", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UserDto.prototype, "created_at", void 0);
exports.default = UserDto;
