"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeedController {
    constructor(feedService) {
        this.feedService = feedService;
    }
    ;
    async getTotalFeed(req, res, next) {
        try {
            const data = await this.feedService.getTotalFeed();
            res.status(200).send({ count: data });
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async getUserFeed(req, res, next) {
        try {
            const { post_ids, user_id } = req.body;
            const values = post_ids.length ? post_ids : [0];
            const data = await this.feedService.getUserFeed(values, user_id);
            res.status(200).send({ feed: data });
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
    async getExploreFeed(req, res, next) {
        try {
            const { user_id } = req.body;
            const data = await this.feedService.getExploreFeed(user_id);
            res.status(200).send({ explore: data });
        }
        catch (error) {
            next(error);
        }
        ;
    }
    ;
}
;
exports.default = FeedController;
