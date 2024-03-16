import express from "express";
import { getExploreFeed, getTotalFeed, getUserFeed } from "../controller/feed";

const router = express.Router();

router.get("/count", getTotalFeed);
router.get("/explore", getExploreFeed);
router.post("/", getUserFeed);

export default router;
