import express        from "express";
import FeedService    from "@/application/services/feed/feed.service.impl";
import FeedController from "@/presentation/controllers/feed.controller";
import FeedRepository from "@/infrastructure/repositories/feed.repository.impl";
import UserRepository from "@/infrastructure/repositories/user.repository.impl";

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
