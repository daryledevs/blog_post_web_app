"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
class UserService {
    userRepository;
    followRepository;
    recentSearchRepository;
    constructor(userRepository, followRepository, recentSearchRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
        this.recentSearchRepository = recentSearchRepository;
    }
    ;
    async getUserById(id) {
        try {
            // If no parameters are provided, return an error
            if (!id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by user_id
            const data = await this.userRepository.findUserById(id);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserByUsername(username) {
        try {
            // If no parameters are provided, return an error
            if (!username)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by username
            const data = await this.userRepository.findUserByUsername(username);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
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
            // If no parameters are provided, return an error
            if (!email)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by email
            const data = await this.userRepository.findUserByEmail(email);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            return data;
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async updateUser(id, user) {
        try {
            // If no parameters are provided, return an error
            if (!id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by email
            const data = await this.userRepository.findUserById(id);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
            return await this.userRepository.updateUser(id, user);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async deleteUserById(id) {
        try {
            // If no parameters are provided, return an error
            if (!id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by email
            const data = await this.userRepository.findUserById(id);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("User not found");
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
            // If no parameters are provided, return an error
            if (!search)
                throw error_exception_1.default.badRequest("No arguments provided");
            // search the user by search query
            const data = await this.userRepository.searchUsersByQuery(search);
            // If the user is not found, return an error
            if (!data?.length)
                throw error_exception_1.default.notFound("User not found");
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
            // If no parameters are provided, return an error
            if (!user_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // Check if the user is already following the other user
            const isExist = await this.userRepository.findUserById(user_id);
            // If the user is not found, return an error
            if (!isExist)
                throw error_exception_1.default.notFound("User not found");
            // search the user by search query
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
                    throw error_exception_1.default.badRequest("Invalid fetch parameter");
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
exports.default = UserService;
