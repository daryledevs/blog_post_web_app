import FeedService                         from "@/application/services/feed/feed.service.impl";
import AsyncWrapper                        from "@/application/utils/async-wrapper.util";
import { NextFunction, Request, Response } from "express";

class FeedController {
  private feedService: FeedService;
  private wrap: AsyncWrapper = new AsyncWrapper();

  constructor(feedService: FeedService) {
    this.feedService = feedService;
  }

  public getTotalFeed = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const data = await this.feedService.getTotalFeed();
      res.status(200).send({ count: data });
    }
  );

  public getUserFeed = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { post_ids, user_id } = req.body;
      const values = post_ids.length ? post_ids : [0];
      const data = await this.feedService.getUserFeed(values, user_id);
      res.status(200).send({ feed: data });
    }
  );

  public getExploreFeed = this.wrap.apiWrap(
    async (req: Request, res: Response, next: NextFunction) => {
      const { user_id } = req.body;
      const data = await this.feedService.getExploreFeed(user_id);
      res.status(200).send({ explore: data });
    }
  );
};

export default FeedController;