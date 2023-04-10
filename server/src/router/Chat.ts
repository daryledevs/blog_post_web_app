import {
  newConversation,
  getMessage,
  newMessage,
  getAllChats,
  getAllChatMember
} from "../controller/Chat";
import express from "express";

const router = express.Router();

router.get("/:length/:user_id", getAllChats);
router.get("/:user_id", getAllChatMember);
router.post("/", newConversation);
router.post("/message/:conversation_id", getMessage);
router.post("/message", newMessage);

export default router;