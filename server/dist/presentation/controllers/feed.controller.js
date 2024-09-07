"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeedController {
    feedService;
    constructor(feedService) {
        this.feedService = feedService;
    }
    getTotalFeed = async (req, res) => {
        const data = await this.feedService.getTotalFeed();
        res.status(200).send({ count: data });
    };
    getUserFeed = async (req, res) => {
        const { post_ids, user_id } = req.body;
        const values = post_ids.length ? post_ids : [0];
        const data = await this.feedService.getUserFeed(values, user_id);
        res.status(200).send({ feed: data });
    };
    getExploreFeed = async (req, res) => {
        const { user_id } = req.body;
        const data = await this.feedService.getExploreFeed(user_id);
        res.status(200).send({ explore: data });
    };
}
;
exports.default = FeedController;
