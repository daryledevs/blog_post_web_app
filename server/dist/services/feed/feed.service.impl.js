"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
class FeedService {
    feedRepository;
    userRepository;
    constructor(feedRepository, userRepository) {
        this.feedRepository = feedRepository;
        this.userRepository = userRepository;
    }
    ;
    async getTotalFeed() {
        try {
            return await this.feedRepository.getTotalFeed();
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getUserFeed(user_id, post_ids) {
        try {
            if (!user_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            const isUserExists = await this.userRepository.findUserById(user_id);
            if (!isUserExists)
                throw error_exception_1.default.notFound("User not found");
            return await this.feedRepository.getUserFeed(user_id, post_ids);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
    async getExploreFeed(user_id) {
        try {
            if (!user_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            const isUserExists = await this.userRepository.findUserById(user_id);
            if (!isUserExists)
                throw error_exception_1.default.notFound("User not found");
            return await this.feedRepository.getExploreFeed(user_id);
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
}
;
exports.default = FeedService;
