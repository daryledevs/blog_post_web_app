
import express         from "express";
import ChatsController from "@/controller/chat.controller";
import UserRepository  from "@/repository/user/user.repository.impl";
import ChatsRepository from "@/repository/chat/chat.repository.impl";
import ChatsServices   from "@/service/chat/chat.service.impl";

const router = express.Router();

const controller: ChatsController = new ChatsController(
  new ChatsServices(
    new ChatsRepository(),
    new UserRepository(),
  )
);

router.post("/:conversation_id/messages", controller.getChatMessages);
router.post("/lists",                     controller.getChatHistory);
router.post("/",                          controller.newMessageAndConversation);

export default router;
