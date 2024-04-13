"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class FeedService {
    feedRepository;
    userRepository;
    wrap = new async_wrapper_util_1.default();
    constructor(feedRepository, userRepository) {
        this.feedRepository = feedRepository;
        this.userRepository = userRepository;
    }
    getTotalFeed = this.wrap.asyncWrap(async () => {
        return await this.feedRepository.getTotalFeed();
    });
    getUserFeed = this.wrap.asyncWrap(async (user_id, post_ids) => {
        // If no arguments are provided, return an error
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isUserExists = await this.userRepository.findUserById(user_id);
        if (!isUserExists)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the user feed
        return await this.feedRepository.getUserFeed(user_id, post_ids);
    });
    getExploreFeed = this.wrap.asyncWrap(async (user_id) => {
        // If no arguments are provided, return an error
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isUserExists = await this.userRepository.findUserById(user_id);
        if (!isUserExists)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the explore feed
        return await this.feedRepository.getExploreFeed(user_id);
    });
}
;
exports.default = FeedService;
