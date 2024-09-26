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
        const uuid = req.session?.user?.uuid;
        const username = req.query.username || "";
        if (username) {
            user = await this.userService.getUserByUsername(username);
        }
        else {
            user = await this.userService.getUserById(uuid);
        }
        res.status(200).send({ user: user?.getUsers() });
    };
    searchUsersByQuery = async (req, res) => {
        const searchQuery = req.query.searchQuery;
        const users = await this.userService.searchUserByFields(searchQuery);
        const usersList = users.map((user) => user.getUsers());
        res.status(200).send({ users: usersList });
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
        const uuid = req.params.uuid;
        const fetchFollowType = req.query.fetchFollowType;
        const followListIds = req.body.followListIds;
        const followLists = await this.followService.getFollowerFollowingLists(uuid, fetchFollowType, followListIds);
        let followList = [];
        if (fetchFollowType === "followers") {
            // Type assertion is used to convert the type of the followLists array to FollowerDto[]
            followList = followLists.map((follower) => follower.getFollowers());
        }
        else {
            // Type assertion is used to convert the type of the followLists array to FollowingDto[]
            followList = followLists.map((follower) => follower.getFollowing());
        }
        res.status(200).send({ followList });
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
        const message = await this.searchHistoryService.saveUsersSearch(searcher_uuid, searched_uuid);
        res.status(200).send({ message });
    };
    removeRecentSearches = async (req, res) => {
        const uuid = req.params.uuid;
        const message = await this.searchHistoryService.removeRecentSearchesById(uuid);
        res.status(200).send(message);
    };
}
;
exports.default = UsersController;
