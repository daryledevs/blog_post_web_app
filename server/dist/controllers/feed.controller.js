"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_wrapper_util_1 = __importDefault(require("@/utils/async-wrapper.util"));
class FeedController {
    feedService;
    wrap = new async_wrapper_util_1.default();
    constructor(feedService) {
        this.feedService = feedService;
    }
    getTotalFeed = this.wrap.apiWrap(async (req, res, next) => {
        const data = await this.feedService.getTotalFeed();
        res.status(200).send({ count: data });
    });
    getUserFeed = this.wrap.apiWrap(async (req, res, next) => {
        const { post_ids, user_id } = req.body;
        const values = post_ids.length ? post_ids : [0];
        const data = await this.feedService.getUserFeed(values, user_id);
        res.status(200).send({ feed: data });
    });
    getExploreFeed = this.wrap.apiWrap(async (req, res, next) => {
        const { user_id } = req.body;
        const data = await this.feedService.getExploreFeed(user_id);
        res.status(200).send({ explore: data });
    });
}
;
exports.default = FeedController;
