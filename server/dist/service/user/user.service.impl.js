"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = __importDefault(require("@/exception/exception"));
class UsersService {
    constructor(userRepository, followRepository, recentSearchRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
        this.recentSearchRepository = recentSearchRepository;
    }
    ;
    async getUserById(id, person) {
        try {
            let data;
            // If no parameters are provided, return an error
            if (!id && !person)
                throw exception_1.default.badRequest("No parameters provided");
            // If the person is provided, search the user by username
            if (person)
                data = await this.userRepository.findUserByUsername(person);
            // If the user_id is provided, search the user by user_id
            if (!person && id)
                data = await this.userRepository.findUserById(id);
            // If the user is not found, return an error
            if (!data)
                throw exception_1.default.notFound("User not found");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserByEmail(email) {
        try {
            return await this.userRepository.findUserByEmail(email);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async updateUser(id, user) {
        try {
            return await this.userRepository.updateUser(id, user);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async deleteUser(id) {
        try {
            return await this.userRepository.deleteUser(id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async searchUserByFields(search) {
        try {
            const data = await this.userRepository.searchUsersByQuery(search);
            // If the user is not found, return an error
            if (!data?.length)
                throw exception_1.default.notFound("User not found");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getAllRecentSearches(user_id) {
        try {
            return await this.recentSearchRepository.getRecentSearches(user_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async saveRecentSearches(user_id, search_user_id) {
        try {
            return await this.recentSearchRepository.saveRecentSearches(user_id, search_user_id);
        }
        catch (error) {
            throw error;
        }
    }
    ;
    async removeRecentSearches(recent_id) {
        try {
            return await this.recentSearchRepository.deleteRecentSearches(recent_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getFollowStats(user_id) {
        try {
            return await this.followRepository.getFollowStats(user_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getFollowerFollowingLists(user_id, fetch, listsId) {
        try {
            const listIdsToExclude = listsId?.length ? listsId : [0];
            switch (fetch) {
                case "followers":
                    return this.followRepository.getFollowersLists(user_id, listIdsToExclude);
                case "following":
                    return this.followRepository.getFollowingLists(user_id, listIdsToExclude);
                default:
                    throw exception_1.default.badRequest("Invalid fetch parameter");
            }
            ;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async toggleFollow(user_id, followed_id) {
        try {
            let result = undefined;
            const args = {
                follower_id: user_id,
                followed_id: followed_id,
            };
            // Check if the user is already following the other user
            const isExist = await this.followRepository.isFollowUser(args);
            // If it already exists, delete the data from the database
            if (isExist)
                result = await this.followRepository.unfollowUser(args);
            // if there is no data in the database, create one
            if (!isExist)
                result = await this.followRepository.followUser(args);
            return result;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
}
;
exports.default = UsersService;
