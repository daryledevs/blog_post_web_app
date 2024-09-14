"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UsersController {
    userService;
    followService;
    searchHistoryService;
    constructor(userService, followService, searchHistoryService) {
        this.userService = userService;
        this.followService = followService;
        this.searchHistoryService = searchHistoryService;
    }
    getUserData = async (req, res) => {
        let user;
        const uuid = req.params.uuid;
        const username = req.query.username || "";
        if (username) {
            user = await this.userService.getUserByUsername(username);
        }
        else {
            user = await this.userService.getUserById(uuid);
        }
        res.status(200).send({ user });
    };
    searchUsersByQuery = async (req, res) => {
        const search = req.query.search;
        const users = await this.userService.searchUserByFields(search);
        res.status(200).send({ users });
    };
    deleteUser = async (req, res) => {
        const uuid = req.params.uuid;
        const message = await this.userService.deleteUserById(uuid);
        res.status(200).send({ message });
    };
    getFollowStats = async (req, res) => {
        const uuid = req.params.uuid;
        const stats = await this.followService.getFollowStats(uuid);
        res.status(200).send(stats);
    };
    getFollowerFollowingLists = async (req, res) => {
        const id = req.params.id;
        const fetch = req.query.fetch;
        const listsId = req.body.listsId;
        const stats = await this.followService.getFollowerFollowingLists(id, fetch, listsId);
        res.status(200).send(stats);
    };
    toggleFollow = async (req, res) => {
        const follower_uuid = req.params.follower_uuid;
        const followed_uuid = req.params.followed_uuid;
        const message = await this.followService.toggleFollow(follower_uuid, followed_uuid);
        res.status(200).send(message);
    };
    getSearchHistory = async (req, res) => {
        const searcher_uuid = req.params.searcher_uuid;
        const searches = await this.searchHistoryService.getUsersSearchHistoryById(searcher_uuid);
        res.status(200).send({ searches });
    };
    saveRecentSearches = async (req, res) => {
        const searcher_uuid = req.params.searcher_uuid;
        const searched_uuid = req.params.searched_uuid;
        const messages = await this.searchHistoryService.saveUsersSearch(searcher_uuid, searched_uuid);
        res.status(200).send({ messages });
    };
    removeRecentSearches = async (req, res) => {
        const uuid = req.params.uuid;
        const message = await this.searchHistoryService.removeRecentSearchesById(uuid);
        res.status(200).send(message);
    };
}
;
exports.default = UsersController;
