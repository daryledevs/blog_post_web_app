
import express                   from "express";
import AsyncWrapper              from "@/application/utils/async-wrapper.util";
import ChatsServices             from "@/application/services/chat/chat.service.impl";
import UserRepository            from "@/infrastructure/repositories/user.repository.impl";
import ChatsController           from "@/presentation/controllers/chat.controller";
import ChatsRepository           from "@/infrastructure/repositories/chat.repository.impl";
import validateUUIDRequestBody   from "../validations/validate-uuid-body.validation";
import validateUUIDRequestParams from "../validations/validate-uuid-params.validation";

const router = express.Router();
const wrap = new AsyncWrapper();

const controller: ChatsController = new ChatsController(
  new ChatsServices(
    new ChatsRepository(),
    new UserRepository(),
  )
);

router
  .route("/:uuid")
  .all(
    validateUUIDRequestParams("uuid"), 
    validateUUIDRequestBody("messageIds")
  )
  .post(wrap.asyncErrorHandler(controller.getChatMessages))
  .delete(wrap.asyncErrorHandler(controller.deleteConversationById));
  
router
  .route("/chat-history")
  .all(
    validateUUIDRequestParams("user_uuid"),
    validateUUIDRequestBody("conversationIds")
  )
  .post(wrap.asyncErrorHandler(controller.getChatHistory));

router
  .route("/")
  .all(validateUUIDRequestBody([
    "conversation_uuid", 
    "sender_uuid", 
    "receiver_uuid"
  ]))
  .post(wrap.asyncErrorHandler(controller.newMessageAndConversation));

export default router;
