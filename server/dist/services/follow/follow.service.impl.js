"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_exception_1 = __importDefault(require("@/exceptions/error.exception"));
class FollowService {
    userRepository;
    followRepository;
    constructor(userRepository, followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }
    ;
    async getFollowStats(user_id) {
        try {
            // If no arguments are provided, return an error
            if (!user_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // Check if the user is already following the other user
            const isExist = await this.userRepository.findUserById(user_id);
            if (!isExist)
                throw error_exception_1.default.notFound("User not found");
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
            // If no arguments are provided, return an error
            if (!user_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            // Check if the user is already following the other user
            const isExist = await this.userRepository.findUserById(user_id);
            if (!isExist)
                throw error_exception_1.default.notFound("User not found");
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
            if (!user_id || !followed_id)
                throw error_exception_1.default.badRequest("No arguments provided");
            const args = {
                follower_id: user_id,
                followed_id: followed_id,
            };
            const user = await this.userRepository.findUserById(user_id);
            if (!user)
                throw error_exception_1.default.notFound("User not found");
            const otherUser = await this.userRepository.findUserById(followed_id);
            if (!otherUser)
                throw error_exception_1.default.notFound("The user to be followed doesn't exist");
            // Check if the user is already following the other user
            const isExist = await this.followRepository.isFollowUser(args);
            // If it already exists, delete the data from the database
            if (isExist) {
                await this.followRepository.unfollowUser(args);
                return "User unfollowed successfully";
            }
            ;
            // if there is no data in the database, create one
            await this.followRepository.followUser(args);
            return "User followed successfully";
        }
        catch (error) {
            throw error;
        }
        ;
    }
    ;
}
;
exports.default = FollowService;
