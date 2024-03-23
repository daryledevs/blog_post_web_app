"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExploreFeed = exports.getUserFeed = exports.getTotalFeed = void 0;
const feed_repository_1 = __importDefault(require("../repository/feed-repository"));
const getTotalFeed = async (req, res, next) => {
    try {
        const data = await feed_repository_1.default.getTotalFeed();
        res.status(200).send({ count: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.getTotalFeed = getTotalFeed;
const getUserFeed = async (req, res, next) => {
    try {
        const { post_ids, user_id } = req.body;
        const values = post_ids.length ? post_ids : [0];
        const data = await feed_repository_1.default.getUserFeed(values, user_id);
        res.status(200).send({ feed: data });
    }
    catch (error) {
        next(error);
    }
    ;
};
exports.getUserFeed = getUserFeed;
const getExploreFeed = async (req, res, next) => {
    try {
        const { user_id } = req.body;
        const data = await feed_repository_1.default.getExploreFeed(user_id);
        res.status(200).send({ explore: data });
    }
    catch (error) {
        next(error);
    }
};
exports.getExploreFeed = getExploreFeed;
