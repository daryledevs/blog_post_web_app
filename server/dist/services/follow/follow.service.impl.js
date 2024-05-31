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
    getFollowStats = this.wrap.serviceWrap(async (uuid) => {
        // If no arguments are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return await this.followRepository.findUserFollowStatsById(user.id);
    });
    getFollowerFollowingLists = this.wrap.serviceWrap(async (uuid, fetch, listsId) => {
        // If no arguments are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        const listIdsToExclude = listsId?.length ? listsId : [0];
        switch (fetch) {
            case "followers":
                return this.getFollowers(user.id, listIdsToExclude);
            case "following":
                return this.getFollowing(user.id, listIdsToExclude);
            default:
                throw api_exception_1.default.HTTP400Error("Invalid fetch parameter");
        }
    });
    toggleFollow = this.wrap.serviceWrap(async (follower_uuid, followed_uuid) => {
        // If no arguments are provided, return an error
        if (!follower_uuid || !followed_uuid) {
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        }
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(follower_uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        // If the user is not found, return an error
        const otherUser = await this.userRepository.findUserById(followed_uuid);
        if (!otherUser)
            throw api_exception_1.default.HTTP404Error("User not found");
        const args = {
            follower_id: user.id,
            followed_id: otherUser.id,
        };
        // Check if the user is already following the other user
        const isExist = await this.followRepository.isUserFollowing(args);
        // If it already exists, delete the data from the database
        if (isExist) {
            await this.followRepository.unfollowUser(args);
            return "User unfollowed successfully";
        }
        // if there is no data in the database, create one
        await this.followRepository.followUser(args);
        return "User followed successfully";
    });
    getFollowers = this.wrap.serviceWrap(async (id, lists) => {
        return await this.followRepository.findAllFollowersById(id, lists);
    });
    getFollowing = this.wrap.serviceWrap(async (id, lists) => {
        return await this.followRepository.findAllFollowersById(id, lists);
    });
}
;
exports.default = FollowService;
