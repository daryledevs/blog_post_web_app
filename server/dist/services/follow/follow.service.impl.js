"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
const api_exception_1 = __importDefault(require("@/exceptions/api.exception"));
class FollowService {
    userRepository;
    followRepository;
    wrap = new async_wrapper_util_1.default();
    constructor(userRepository, followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }
    getFollowStats = this.wrap.serviceWrap(async (user_id) => {
        // If no arguments are provided, return an error
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isExist = await this.userRepository.findUserById(user_id);
        if (!isExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        return await this.followRepository.getFollowStats(user_id);
    });
    getFollowerFollowingLists = this.wrap.serviceWrap(async (user_id, fetch, listsId) => {
        // If no arguments are provided, return an error
        if (!user_id)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const isExist = await this.userRepository.findUserById(user_id);
        if (!isExist)
            throw api_exception_1.default.HTTP404Error("User not found");
        const listIdsToExclude = listsId?.length ? listsId : [0];
        switch (fetch) {
            case "followers":
                return this.followRepository.getFollowersLists(user_id, listIdsToExclude);
            case "following":
                return this.followRepository.getFollowingLists(user_id, listIdsToExclude);
            default:
                throw api_exception_1.default.HTTP400Error("Invalid fetch parameter");
        }
    });
    toggleFollow = this.wrap.serviceWrap(async (user_id, followed_id) => {
        // If no arguments are provided, return an error
        if (!user_id || !followed_id)
            throw api_exception_1.default
                .HTTP400Error("No arguments provided");
        const args = {
            follower_id: user_id,
            followed_id: followed_id,
        };
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(user_id);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // If the user is not found, return an error
        const otherUser = await this.userRepository.findUserById(followed_id);
        if (!otherUser)
            throw api_exception_1.default
                .HTTP404Error("The user to be followed doesn't exist");
        // Check if the user is already following the other user
        const isExist = await this.followRepository.isFollowUser(args);
        // If it already exists, delete the data from the database
        if (isExist) {
            await this.followRepository.unfollowUser(args);
            return "User unfollowed successfully";
        }
        // if there is no data in the database, create one
        await this.followRepository.followUser(args);
        return "User followed successfully";
    });
}
;
exports.default = FollowService;
