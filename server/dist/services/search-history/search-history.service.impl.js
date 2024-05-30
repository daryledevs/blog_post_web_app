"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class SearchHistoryService {
    wrap = new async_wrapper_util_1.default();
    userRepository;
    searchHistoryRepository;
    constructor(userRepository, searchHistoryRepository) {
        this.userRepository = userRepository;
        this.searchHistoryRepository = searchHistoryRepository;
    }
    getUsersSearchHistoryById = this.wrap.serviceWrap(async (searcher_uuid) => {
        // If no parameters are provided, return an error
        if (!searcher_uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the user is already following the other user
        const user = await this.userRepository.findUserById(searcher_uuid);
        // If the user is not found, return an error
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // search the user by search query
        return await this.searchHistoryRepository.findSearchHistoryById(user.id);
    });
    saveUsersSearch = this.wrap.serviceWrap(async (searcher_uuid, search_uuid) => {
        // If no parameters are provided, return an error
        if (!searcher_uuid || !search_uuid) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        // Check if the user is already following the other user
        const user = await this.userRepository.findUserById(searcher_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Check if the user is already following the other user
        const searchUser = await this.userRepository.findUserById(search_uuid);
        if (!searchUser)
            throw api_exception_1.default.HTTP404Error("Search user not found");
        const isExist = await this.searchHistoryRepository
            .findUsersSearchByUsersId(user.id, searchUser.id);
        if (isExist)
            return "Search user already saved";
        await this.searchHistoryRepository.saveUsersSearch(user.id, searchUser.id);
        return "Search user saved successfully";
    });
    removeRecentSearchesById = this.wrap.serviceWrap(async (uuid) => {
        // If no parameters are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the user searched the other user
        const search = await this.searchHistoryRepository
            .findUsersSearchById(uuid);
        // If the user is not found, return an error
        if (!search)
            throw api_exception_1.default.HTTP404Error("Recent search not found");
        await this.searchHistoryRepository.deleteUsersSearchById(search.id);
        return "Search user deleted successfully";
    });
}
;
exports.default = SearchHistoryService;
