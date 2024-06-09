"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    id;
    uuid;
    username;
    email;
    password;
    first_name;
    last_name;
    age;
    roles;
    avatar_url;
    birthday;
    created_at;
    constructor(user) {
        Object.assign(this, user);
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
        throw new Error("Password is restricted");
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
exports.default = User;
