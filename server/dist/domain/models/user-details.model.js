"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDetails {
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
    getAge() {
        return this.age || null;
    }
    getBirthday() {
        return this.birthday || null;
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
    setAge(age) {
        this.age = age;
    }
    setBirthday(birthday) {
        this.birthday = birthday;
    }
}
exports.default = UserDetails;
