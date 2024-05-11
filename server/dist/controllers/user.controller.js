"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
class UsersController {
    userService;
    followService;
    recentSearchService;
    wrap = new async_wrapper_util_1.default();
    constructor(userService, followService, recentSearchService) {
        this.userService = userService;
        this.followService = followService;
        this.recentSearchService = recentSearchService;
    }
    getUserData = this.wrap.apiWrap(async (req, res, next) => {
        let user;
        const user_id = req.body.user_id;
        const person = req.query.person || "";
        if (person) {
            user = await this.userService.getUserByUsername(person);
        }
        else {
            user = await this.userService.getUserById(user_id);
        }
        res.status(200).send({ user });
    });
    searchUsersByQuery = this.wrap.apiWrap(async (req, res, next) => {
        const search = req.query.search;
        const users = await this.userService.searchUserByFields(search);
        res.status(200).send({ users });
    });
    deleteUser = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const message = await this.userService.deleteUserById(user_id);
        res.status(200).send(message);
    });
    getFollowStats = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const stats = await this.followService.getFollowStats(user_id);
        res.status(200).send(stats);
    });
    getRecentSearches = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const searches = await this.recentSearchService
            .getAllRecentSearches(user_id);
        res.status(200).send(searches);
    });
    getFollowerFollowingLists = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const fetch = req.query.fetch;
        const listsId = req.body.listsId;
        const users = await this.followService.getFollowerFollowingLists(user_id, fetch, listsId);
        res.status(200).send(users);
    });
    toggleFollow = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const followed_id = req.params.followed_id;
        const message = await this.followService.toggleFollow(user_id, followed_id);
        res.status(200).send(message);
    });
    saveRecentSearches = this.wrap.apiWrap(async (req, res, next) => {
        const user_id = req.params.user_id;
        const search_user_id = req.params.searched_id;
        const message = await this.recentSearchService.saveRecentSearches(user_id, search_user_id);
        res.status(200).send(message);
    });
    removeRecentSearches = this.wrap.apiWrap(async (req, res, next) => {
        const recent_id = req.params.recent_id;
        const message = await this.recentSearchService
            .removeRecentSearches(recent_id);
        res.status(200).send(message);
    });
}
;
exports.default = UsersController;
