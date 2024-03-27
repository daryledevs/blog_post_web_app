"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_impl_1 = __importDefault(require("../service/user/user.service.impl"));
class UsersController {
    constructor() { this.userService = new user_service_impl_1.default(); }
    ;
    async getUserData(req, res, next) {
        try {
            const user_id = req.body.user_id;
            const person = req.query.person || "";
            const user = await this.userService.getUserById(user_id, person);
            res.status(200).send(user);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async searchUsersByQuery(req, res, next) {
        try {
            const search = req.query.search;
            const users = await this.userService.searchUserByFields(search);
            res.status(200).send(users);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async deleteUser(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const message = await this.userService.deleteUser(user_id);
            res.status(200).send(message);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async getFollowStats(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const stats = await this.userService.getFollowStats(user_id);
            res.status(200).send(stats);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async getRecentSearches(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const searches = await this.userService.getAllRecentSearches(user_id);
            res.status(200).send(searches);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async getFollowerFollowingLists(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const fetch = req.query.fetch;
            const listsId = req.body.listsId;
            const users = await this.userService.getFollowerFollowingLists(user_id, fetch, listsId);
            res.status(200).send(users);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async toggleFollow(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const followed_id = req.params.followed_id;
            const message = await this.userService.toggleFollow(user_id, followed_id);
            res.status(200).send(message);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async saveRecentSearches(req, res, next) {
        try {
            const user_id = req.params.user_id;
            const search_user_id = req.params.searched_id;
            const message = await this.userService.saveRecentSearches(user_id, search_user_id);
            res.status(200).send(message);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async removeRecentSearches(req, res, next) {
        try {
            const recent_id = req.params.recent_id;
            const message = await this.userService.removeRecentSearches(recent_id);
            res.status(200).send(message);
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
}
;
exports.default = UsersController;
