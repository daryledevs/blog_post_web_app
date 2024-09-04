"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const follower_dto_1 = __importDefault(require("@/domain/dto/follower.dto"));
const following_dto_1 = __importDefault(require("@/domain/dto/following.dto"));
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const class_transformer_1 = require("class-transformer");
class FollowService {
    userRepository;
    followRepository;
    constructor(userRepository, followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }
    getFollowStats = async (uuid) => {
        // If no arguments are provided, return an error
        if (!uuid)
            throw api_exception_1.default.HTTP400Error("No arguments provided");
        // If the user is not found, return an error
        const user = await this.userRepository.findUserById(uuid);
        if (!user)
            throw api_exception_1.default.HTTP404Error("User not found");
        return await this.followRepository.findUserFollowStatsById(user.getId());
    };
    getFollowerFollowingLists = async (uuid, fetch, listsId) => {
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
                const followers = await this.getFollowers(user.getId(), listIdsToExclude);
                return (0, class_transformer_1.plainToInstance)(follower_dto_1.default, followers, {
                    excludeExtraneousValues: true,
                });
            case "following":
                const following = await this.getFollowing(user.getId(), listIdsToExclude);
                return (0, class_transformer_1.plainToInstance)(following_dto_1.default, following, {
                    excludeExtraneousValues: true,
                });
            default:
                throw api_exception_1.default.HTTP400Error("Invalid fetch parameter");
        }
    };
    toggleFollow = async (follower_uuid, followed_uuid) => {
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
            follower_id: user.getId(),
            followed_id: otherUser.getId(),
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
    };
    getFollowers = async (id, lists) => {
        return await this.followRepository.findAllFollowersById(id, lists);
    };
    getFollowing = async (id, lists) => {
        return await this.followRepository.findAllFollowingById(id, lists);
    };
}
;
exports.default = FollowService;
