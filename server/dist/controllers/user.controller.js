"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsersController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    ;
    getUserData = async (req, res, next) => {
        try {
            let user;
            const user_id = req.body.user_id;
            const person = req.query.person || "";
            if (person) {
                user = await this.userService.getUserByUsername(person);
            }
            else {
                user = await this.userService.getUserById(user_id);
            }
            ;
            res.status(200).send(user);
        }
        catch (error) {
            next(error);
        }
        ;
    };
    searchUsersByQuery = async (req, res, next) => {
        try {
            const search = req.query.search;
            const users = await this.userService.searchUserByFields(search);
            res.status(200).send(users);
        }
        catch (error) {
            next(error);
        }
        ;
    };
    deleteUser = async (req, res, next) => {
        try {
            const user_id = req.params.user_id;
            const message = await this.userService.deleteUserById(user_id);
            res.status(200).send(message);
        }
        catch (error) {
            next(error);
        }
        ;
    };
    getFollowStats = async (req, res, next) => {
        try {
            const user_id = req.params.user_id;
            const stats = await this.userService.getFollowStats(user_id);
            res.status(200).send(stats);
        }
        catch (error) {
            next(error);
        }
        ;
    };
    getRecentSearches = async (req, res, next) => {
        try {
            const user_id = req.params.user_id;
            const searches = await this.userService.getAllRecentSearches(user_id);
            res.status(200).send(searches);
        }
        catch (error) {
            next(error);
        }
        ;
    };
    getFollowerFollowingLists = async (req, res, next) => {
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
    };
    toggleFollow = async (req, res, next) => {
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
    };
    saveRecentSearches = async (req, res, next) => {
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
    };
    removeRecentSearches = async (req, res, next) => {
        try {
            const recent_id = req.params.recent_id;
            const message = await this.userService.removeRecentSearches(recent_id);
            res.status(200).send(message);
        }
        catch (error) {
            next(error);
        }
        ;
    };
}
;
exports.default = UsersController;
