import FeedService           from "@/application/services/feed/feed.service.impl";
import { Request, Response } from "express";

class FeedController {
  private feedService: FeedService;

  constructor(feedService: FeedService) {
    this.feedService = feedService;
  }

  public getTotalFeed = async (req: Request, res: Response) => {
    const data = await this.feedService.getTotalFeed();
    res.status(200).send({ count: data });
  };

  public getUserFeed = async (req: Request, res: Response) => {
    const { post_ids, user_id } = req.body;
    const values = post_ids.length ? post_ids : [0];
    const data = await this.feedService.getUserFeed(values, user_id);
    res.status(200).send({ feed: data });
  };

  public getExploreFeed = async (req: Request, res: Response) => {
    const { user_id } = req.body;
    const data = await this.feedService.getExploreFeed(user_id);
    res.status(200).send({ explore: data });
  };
};

export default FeedController;