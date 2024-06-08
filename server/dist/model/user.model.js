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
        this.id = user.id;
        this.uuid = user.uuid;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.age = user.age;
        this.roles = user.roles;
        this.avatar_url = user.avatar_url;
        this.birthday = user.birthday;
        this.created_at = user.created_at;
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
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getUuid() {
        return this.uuid;
    }
    setUuid(uuid) {
        this.uuid = uuid;
    }
    getUsername() {
        return this.username;
    }
    setUsername(username) {
        this.username = username;
    }
    getEmail() {
        return this.email;
    }
    setEmail(email) {
        this.email = email;
    }
    getPassword() {
        throw new Error("Password access is restricted");
    }
    setPassword(password) {
        this.password = password;
    }
    getFirstName() {
        return this.first_name;
    }
    setFirstName(first_name) {
        this.first_name = first_name;
    }
    getLastName() {
        return this.last_name;
    }
    setLastName(last_name) {
        this.last_name = last_name;
    }
    getFullName() {
        return `${this.first_name} ${this.last_name}`;
    }
    setFullName(first_name, last_name) {
        this.first_name = first_name;
        this.last_name = last_name;
    }
    getAge() {
        return this.age;
    }
    setAge(age) {
        this.age = age;
    }
    getRoles() {
        return this.roles;
    }
    setRoles(roles) {
        this.roles = roles;
    }
    getAvatarUrl() {
        return this.avatar_url;
    }
    setAvatarUrl(avatar_url) {
        this.avatar_url = avatar_url;
    }
    getBirthday() {
        return this.birthday;
    }
    setBirthday(birthday) {
        this.birthday = birthday;
    }
    getCreatedAt() {
        return this.created_at;
    }
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }
}
exports.default = User;
