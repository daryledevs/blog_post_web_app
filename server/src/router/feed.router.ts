import express        from "express";
import FeedService    from "@/service/feed/feed.service.impl";
import FeedController from "@/controller/feed.controller";
import FeedRepository from "@/repository/feed/feed.repository.impl";
import UserRepository from "@/repository/user/user.repository.impl";

const router = express.Router();

const controller: FeedController = new FeedController(
  new FeedService(
    new FeedRepository(), 
    new UserRepository()
  )
);

router.get("/count",   controller.getTotalFeed);
router.get("/explore", controller.getExploreFeed);
router.post("/",       controller.getUserFeed);

export default router;
