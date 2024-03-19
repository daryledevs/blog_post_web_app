import { NextFunction, Request, Response } from "express";
import FeedRepository from "../repository/feed-repository";

const getTotalFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await FeedRepository.getTotalFeed();
    res.status(200).send({ count: data });
  } catch (error) {
    next(error)
  };
};

const getUserFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { post_ids, user_id } = req.body;
    const values = post_ids.length ? post_ids : [0];
    const data = await FeedRepository.getUserFeed(values, user_id);
    res.status(200).send({ feed: data });
  } catch (error) {
    next(error)
  };
};

const getExploreFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.body;
    const data = await FeedRepository.getExploreFeed(user_id);
    res.status(200).send({ explore: data });
  } catch (error) {
    next(error);
  }
};

export { getTotalFeed, getUserFeed, getExploreFeed };