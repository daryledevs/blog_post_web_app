import express from "express";
import { findUser, findUsername, getTotalFeed, getUserFeed, userData } from "../controller/user";
const router = express.Router();
import accessToken from "../middleware/accessToken";

router.use(accessToken);
router.get("/", userData);
router.post("/feed", getUserFeed);
router.get("/search", findUser);
router.get("/feed/count", getTotalFeed);
router.get("/:username", findUsername);

export default router;
