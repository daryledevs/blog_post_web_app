"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
class RecentSearchService {
    userRepository;
    recentSearchRepository;
    constructor(userRepository, recentSearchRepository) {
        this.userRepository = userRepository;
        this.recentSearchRepository = recentSearchRepository;
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
            // If no parameters are provided, return an error
            if (!user_id || !search_user_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // Check if the user is already following the other user
            const user = await this.userRepository.findUserById(user_id);
            if (!user)
                throw error_exception_1.default.notFound("User not found");
            // Check if the user is already following the other user
            const searchUser = await this.userRepository.findUserById(search_user_id);
            if (!searchUser)
                throw error_exception_1.default.notFound("Search user not found");
            const isExist = await this.recentSearchRepository
                .findUsersSearchByUserId(user_id, search_user_id);
            if (isExist)
                return "Search user already saved";
            await this.recentSearchRepository.saveRecentSearches(user_id, search_user_id);
            return "Search user saved successfully";
        }
        catch (error) {
            throw error;
        }
    }
    ;
    async removeRecentSearches(recent_id) {
        try {
            // If no parameters are provided, return an error
            if (!recent_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // Check if the user searched the other user
            const data = await this.recentSearchRepository
                .findUsersSearchByRecentId(recent_id);
            // If the user is not found, return an error
            if (!data)
                throw error_exception_1.default.notFound("Recent search not found");
            await this.recentSearchRepository.deleteRecentSearches(recent_id);
            return "Search user deleted successfully";
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
}
;
exports.default = RecentSearchService;
