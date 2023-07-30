import express from "express";
import { getExploreFeed, getTotalFeed, getUserFeed } from "../controller/feed";

const router = express.Router();

router.post("/user", getUserFeed);
router.get("/count", getTotalFeed);
router.get("/explore/:user_id", getExploreFeed);

export default router;
