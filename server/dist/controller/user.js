"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFollow = exports.getFollowerFollowingLists = exports.getFollowStats = exports.removeRecentSearches = exports.getRecentSearches = exports.saveRecentSearches = exports.searchUsersByQuery = exports.getUserData = void 0;
const exception_1 = __importDefault(require("../exception/exception"));
const user_repository_1 = __importDefault(require("../repository/user-repository"));
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.body;
        const { person } = req.query;
        let data = undefined;
        // If no parameters are provided, return an error
        if (!user_id && !person)
            return next(exception_1.default.badRequest("No parameters provided"));
        // If the person is provided, search the user by username
        if (person)
            data = yield user_repository_1.default.findUserByUsername(person);
        // If the user_id is provided, search the user by user_id
        if (!person && user_id)
            data = yield user_repository_1.default.findUserById(user_id);
        // If the user is not found, return an error
        if (!data)
            return next(exception_1.default.notFound("User not found"));
        const { PASSWORD } = data, rest = __rest(data, ["PASSWORD"]);
        res.status(200).send({ user: rest });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserData = getUserData;
const searchUsersByQuery = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        const data = yield user_repository_1.default.searchUsersByQuery(search);
        // If the user is not found, return an error
        if (!(data === null || data === void 0 ? void 0 : data.length))
            return next(exception_1.default.notFound("User not found"));
        res.status(200).send({ users: data });
    }
    catch (error) {
        next(error);
    }
});
exports.searchUsersByQuery = searchUsersByQuery;
const getRecentSearches = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const data = yield user_repository_1.default.getRecentSearches(user_id);
        return res.status(200).send({ users: data });
    }
    catch (error) {
        next(error);
    }
});
exports.getRecentSearches = getRecentSearches;
const saveRecentSearches = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id, searched_id } = req.params;
        const data = yield user_repository_1.default.saveRecentSearches(user_id, searched_id);
        return res.status(200).send({ message: data });
    }
    catch (error) {
        next(error);
    }
});
exports.saveRecentSearches = saveRecentSearches;
const removeRecentSearches = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { recent_id } = req.params;
        const data = yield user_repository_1.default.deleteRecentSearches(recent_id);
        return res.status(200).send({ users: data });
    }
    catch (error) {
        next(error);
    }
});
exports.removeRecentSearches = removeRecentSearches;
const getFollowStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const { followers, following } = yield user_repository_1.default.getFollowsStats(user_id);
        res.status(200).send({ followers, following });
    }
    catch (error) {
        next(error);
    }
});
exports.getFollowStats = getFollowStats;
const getFollowerFollowingLists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const { listsId } = req.body;
        const { fetch } = req.query;
        const data = yield user_repository_1.default.getFollowerFollowingLists(user_id, fetch, listsId);
        res.status(200).send({ lists: data });
    }
    catch (error) {
        next(error);
    }
});
exports.getFollowerFollowingLists = getFollowerFollowingLists;
const toggleFollow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user_id, followed_id } = req.params;
        let result = undefined;
        const args = {
            follower_id: user_id,
            followed_id: followed_id,
        };
        // Check if the user is already following the other user
        const isExist = yield user_repository_1.default.isFollowUser(args);
        // If it already exists, delete the data from the database
        if (isExist)
            result = yield user_repository_1.default.unfollowUser(args);
        // if there is no data in the database, create one
        if (!isExist)
            result = yield user_repository_1.default.followUser(args);
        res.status(200).send({ message: result });
    }
    catch (error) {
        next(error);
    }
});
exports.toggleFollow = toggleFollow;
