import {
  getMessage,
  newMessageAndConversation,
  getUserConversations,
} from "../controller/chat";
import express from "express";

const router = express.Router();

router.post("/:conversation_id/messages", getMessage);
router.post("/lists", getUserConversations);
router.post("/", newMessageAndConversation);

export default router;
