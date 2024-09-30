"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_history_dto_1 = __importDefault(require("@/domain/dto/search-history.dto"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
class SearchHistoryService {
    userRepository;
    searchHistoryRepository;
    constructor(userRepository, searchHistoryRepository) {
        this.userRepository = userRepository;
        this.searchHistoryRepository = searchHistoryRepository;
    }
    getUsersSearchHistoryById = async (searcherUuid) => {
        // If no parameters are provided, return an error
        if (!searcherUuid) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        // Check if the user is already following the other user
        const user = await this.userRepository.findUserById(searcherUuid);
        // If the user is not found, return an error
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // search the user by search query
        const searches = await this.searchHistoryRepository.findSearchHistoryById(user.getId());
        return (0, class_transformer_1.plainToInstance)(search_history_dto_1.default, searches, {
            excludeExtraneousValues: true,
        });
    };
    saveUsersSearch = async (searcherUuid, searchUuid) => {
        // Check if the user is already following the other user
        const user = await this.userRepository.findUserById(searcherUuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Check if the user is already following the other user
        const searchUser = await this.userRepository.findUserById(searchUuid);
        if (!searchUser)
            throw api_exception_1.default.HTTP404Error("Search user not found");
        const isExist = await this.searchHistoryRepository.findUsersSearchByUsersId(user.getId(), searchUser.getId());
        if (isExist)
            return "Search user already saved";
        await this.searchHistoryRepository.saveUsersSearch(user.getId(), searchUser.getId());
        return "Search user saved successfully";
    };
    removeRecentSearchesById = async (uuid) => {
        // If no parameters are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // Check if the user searched the other user
        const search = await this.searchHistoryRepository.findUsersSearchById(uuid);
        // If the user is not found, return an error
        if (!search)
            throw api_exception_1.default.HTTP404Error("Search user not found");
        await this.searchHistoryRepository.deleteUsersSearchById(search.getId());
        return "Search user deleted successfully";
    };
}
;
exports.default = SearchHistoryService;
