import express        from "express";
import FeedService    from "@/application/services/feed/feed.service.impl";
import AsyncWrapper   from "@/application/utils/async-wrapper.util";
import FeedController from "@/presentation/controllers/feed.controller";
import FeedRepository from "@/infrastructure/repositories/feed.repository.impl";
import UserRepository from "@/infrastructure/repositories/user.repository.impl";

const router = express.Router();
const wrap = new AsyncWrapper();

const controller: FeedController = new FeedController(
  new FeedService(
    new FeedRepository(), 
    new UserRepository()
  )
);

router
  .route("/count")
  .get(wrap.asyncErrorHandler(controller.getTotalFeed));

router
  .route("/explore")
  .get(wrap.asyncErrorHandler(controller.getExploreFeed));

router
  .route("/")
  .post(wrap.asyncErrorHandler(controller.getUserFeed));

export default router;
