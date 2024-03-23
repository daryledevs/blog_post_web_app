"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.toggleFollow = exports.getFollowerFollowingLists = exports.getFollowStats = exports.removeRecentSearches = exports.getRecentSearches = exports.saveRecentSearches = exports.searchUsersByQuery = exports.getUserData = void 0;
const exception_1 = __importDefault(require("../exception/exception"));
const user_repository_1 = __importDefault(require("../repository/user-repository"));
const follow_repository_1 = __importDefault(require("../repository/follow-repository"));
const recent_searches_repository_1 = __importDefault(require("../repository/recent-searches-repository"));
const getUserData = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        const { person } = req.query;
        let data;
        // If no parameters are provided, return an error
        if (!user_id && !person)
            return next(exception_1.default.badRequest("No parameters provided"));
        // If the person is provided, search the user by username
        if (person)
            data = await user_repository_1.default.findUserByUsername(person);
        // If the user_id is provided, search the user by user_id
        if (!person && user_id)
            data = await user_repository_1.default.findUserById(user_id);
        // If the user is not found, return an error
        if (!data)
            return next(exception_1.default.notFound("User not found"));
        const { password, ...rest } = data;
        res.status(200).send({ user: rest });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.getUserData = getUserData;
const deleteUser = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        const data = await user_repository_1.default.deleteUser(user_id);
        res.status(200).send({ message: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.deleteUser = deleteUser;
const searchUsersByQuery = async (req, res, next) => {
    try {
        const { search } = req.query;
        const data = await user_repository_1.default.searchUsersByQuery(search);
        // If the user is not found, return an error
        if (!data?.length)
            return next(exception_1.default.notFound("User not found"));
        res.status(200).send({ users: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.searchUsersByQuery = searchUsersByQuery;
const getRecentSearches = async (req, res, next) => {
    try {
        const user_id = req.params.user_id;
        const data = await recent_searches_repository_1.default.getRecentSearches(user_id);
        return res.status(200).send({ users: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.getRecentSearches = getRecentSearches;
const saveRecentSearches = async (req, res, next) => {
    try {
        const { user_id, searched_id } = req.params;
        // Check if the user is already saved
        const isRecentExists = await recent_searches_repository_1.default.findUsersSearchByUserId(user_id, searched_id);
        // If the user is already saved, return an error
        if (isRecentExists)
            return next(exception_1.default.badRequest("User already saved"));
        const data = await recent_searches_repository_1.default.saveRecentSearches(user_id, searched_id);
        return res.status(200).send({ message: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.saveRecentSearches = saveRecentSearches;
const removeRecentSearches = async (req, res, next) => {
    try {
        const recent_id = req.params.recent_id;
        // Check if the user exists
        const recent = await recent_searches_repository_1.default.findUsersSearchByRecentId(recent_id);
        // If the user does not exist, return an error
        if (recent)
            return next(exception_1.default.notFound("User not found"));
        const data = await recent_searches_repository_1.default.deleteRecentSearches(recent_id);
        return res.status(200).send({ users: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.removeRecentSearches = removeRecentSearches;
const getFollowStats = async (req, res, next) => {
    try {
        const user_id = req.params.user_id;
        const { followers, following } = await follow_repository_1.default.getFollowsStats(user_id);
        res.status(200).send({ followers, following });
    }
    catch (error) {
        next(error);
    }
};
exports.getFollowStats = getFollowStats;
const getFollowerFollowingLists = async (req, res, next) => {
    try {
        const user_id = req.params.user_id;
        const listsId = req.body.listsId;
        const fetch = req.query.fetch;
        const data = await follow_repository_1.default.getFollowerFollowingLists(user_id, fetch, listsId);
        res.status(200).send({ lists: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.getFollowerFollowingLists = getFollowerFollowingLists;
const toggleFollow = async (req, res, next) => {
    try {
        let { user_id, followed_id } = req.params;
        let result = undefined;
        const args = {
            follower_id: user_id,
            followed_id: followed_id,
        };
        // Check if the user is already following the other user
        const isExist = await follow_repository_1.default.isFollowUser(args);
        // If it already exists, delete the data from the database
        if (isExist)
            result = await follow_repository_1.default.unfollowUser(args);
        // if there is no data in the database, create one
        if (!isExist)
            result = await follow_repository_1.default.followUser(args);
        res.status(200).send({ message: result });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.toggleFollow = toggleFollow;
