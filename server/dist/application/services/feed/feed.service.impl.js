"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
class FeedService {
    feedRepository;
    userRepository;
    constructor(feedRepository, userRepository) {
        this.feedRepository = feedRepository;
        this.userRepository = userRepository;
    }
    getTotalFeed = async () => {
        return await this.feedRepository.getTotalFeed();
    };
    getUserFeed = async (user_id, post_uuid) => {
        // If no arguments are provided, return an error
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(user_id);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the user feed
        return await this.feedRepository.getUserFeed(user.getId(), post_uuid);
    };
    getExploreFeed = async (user_id) => {
        // If no arguments are provided, return an error
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(user_id);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // Return the explore feed
        return await this.feedRepository.getExploreFeed(user.getId());
    };
}
;
exports.default = FeedService;
