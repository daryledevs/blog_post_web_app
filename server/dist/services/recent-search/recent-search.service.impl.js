"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class RecentSearchService {
    wrap = new async_wrapper_util_1.default();
    userRepository;
    recentSearchRepository;
    constructor(userRepository, recentSearchRepository) {
        this.userRepository = userRepository;
        this.recentSearchRepository = recentSearchRepository;
    }
    ;
    getAllRecentSearches = this.wrap.serviceWrap(async (user_id) => {
        // If no parameters are provided, return an error
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the user is already following the other user
        const isExist = await this.userRepository.findUserById(user_id);
        // If the user is not found, return an error
        if (!isExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        // search the user by search query
        return await this.recentSearchRepository.getRecentSearches(user_id);
    });
    saveRecentSearches = this.wrap.serviceWrap(async (user_id, search_user_id) => {
        // If no parameters are provided, return an error
        if (!user_id || !search_user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the user is already following the other user
        const user = await this.userRepository.findUserById(user_id);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Check if the user is already following the other user
        const searchUser = await this.userRepository.findUserById(search_user_id);
        if (!searchUser)
            throw api_exception_1.default.HTTP404Error("Search user not found");
        const isExist = await this.recentSearchRepository
            .findUsersSearchByUserId(user_id, search_user_id);
        console.log("TEST: ", isExist);
        if (isExist)
            return "Search user already saved";
        await this.recentSearchRepository.saveRecentSearches(user_id, search_user_id);
        return "Search user saved successfully";
    });
    removeRecentSearches = this.wrap.serviceWrap(async (recent_id) => {
        // If no parameters are provided, return an error
        if (!recent_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the user searched the other user
        const data = await this.recentSearchRepository
            .findUsersSearchByRecentId(recent_id);
        // If the user is not found, return an error
        if (!data)
            throw api_exception_1.default.HTTP404Error("Recent search not found");
        await this.recentSearchRepository.deleteRecentSearches(recent_id);
        return "Search user deleted successfully";
    });
}
;
exports.default = RecentSearchService;
