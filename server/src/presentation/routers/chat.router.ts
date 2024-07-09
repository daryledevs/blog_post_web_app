
import express         from "express";
import ChatsServices   from "@/application/services/chat/chat.service.impl";
import UserRepository  from "@/infrastructure/repositories/user.repository.impl";
import ChatsController from "@/presentation/controllers/chat.controller";
import ChatsRepository from "@/infrastructure/repositories/chat.repository.impl";

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
