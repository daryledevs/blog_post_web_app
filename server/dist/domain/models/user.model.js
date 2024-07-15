"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_details_model_1 = __importDefault(require("./user-details.model"));
class User extends user_details_model_1.default {
    id;
    uuid;
    email;
    password;
    roles;
    created_at;
    constructor(id, uuid, username, email, password, first_name, last_name, age, roles, avatar_url, birthday, created_at) {
        super(username, first_name, last_name, avatar_url, age, birthday);
        this.id = id;
        this.uuid = uuid;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.created_at = created_at;
    }
    save() {
        return {
            username: this.username,
            email: this.email,
            first_name: this.first_name || null,
            last_name: this.last_name || null,
            password: this.password,
            age: this.age || null,
            roles: this.roles,
            avatar_url: this.avatar_url || null,
            birthday: this.birthday || null,
            created_at: this.created_at,
        };
    }
    // getters
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
        throw new Error("Password is restricted");
    }
    getCreatedAt() {
        return this.created_at;
    }
    // setters
    setEmail(value) {
        this.email = value;
    }
    setPassword(value) {
        this.password = value;
    }
    setRoles(value) {
        this.roles = value;
    }
    setCreatedAt(value) {
        this.created_at = value;
    }
}
exports.default = User;
