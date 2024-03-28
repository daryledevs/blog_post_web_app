
import express         from "express";
import ChatsController from "@/controller/chat.controller";

const router = express.Router();
const controller: ChatsController = new ChatsController();

router.post("/:conversation_id/messages", controller.getChatMessages);
router.post("/lists",                     controller.getChatHistory);
router.post("/",                          controller.newMessageAndConversation);

export default router;
