
import express         from "express";
import ChatsController from "@/controllers/chat.controller";
import UserRepository  from "@/repositories/user/user.repository.impl";
import ChatsRepository from "@/repositories/chat/chat.repository.impl";
import ChatsServices   from "@/services/chat/chat.service.impl";

const router = express.Router();

const controller: ChatsController = new ChatsController(
  new ChatsServices(
    new ChatsRepository(),
    new UserRepository(),
  )
);

router.post("/:uuid/messages",  controller.getChatMessages);
router.post("/lists",           controller.getChatHistory);
router.post("/",                controller.newMessageAndConversation);
router.delete("/:uuid",         controller.deleteConversationById)

export default router;
