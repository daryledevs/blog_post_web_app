"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = __importDefault(require("@/exception/exception"));
class FeedService {
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
                throw exception_1.default.badRequest("Missing required fields");
            const isUserExists = await this.userRepository.findUserById(user_id);
            if (!isUserExists)
                throw exception_1.default.notFound("User doesn't exist");
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
                throw exception_1.default.badRequest("Missing required fields");
            const isUserExists = await this.userRepository.findUserById(user_id);
            if (!isUserExists)
                throw exception_1.default.notFound("User doesn't exist");
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
