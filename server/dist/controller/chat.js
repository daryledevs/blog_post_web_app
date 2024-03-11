"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserConversations = exports.newMessageAndConversation = exports.getMessage = void 0;
const query_1 = __importDefault(require("../database/query"));
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.query.user_id || [];
        let conversation_id = req.params.conversation_id;
        const { messages } = req.body || [];
        const ids = (messages === null || messages === void 0 ? void 0 : messages.length) ? messages : 0;
        if (user_id.length) {
            const reverse = user_id.slice().reverse();
            const args = [...user_id, ...reverse];
            const sqlFindConversationId = `
        SELECT *
        FROM CONVERSATIONS
        WHERE 
          (USER_ONE = (?) AND USER_TWO = (?))
          OR 
          (USER_ONE = (?) AND USER_TWO = (?));
      `;
            const [getConversationIdData] = yield (0, query_1.default)(sqlFindConversationId, args);
            if (!getConversationIdData)
                return res.status(200).send({ message: "No conversation found" });
            conversation_id = getConversationIdData.CONVERSATION_ID;
        }
        const sqlGetConversation = `
      SELECT *
      FROM MESSAGES
      WHERE 
          CONVERSATION_ID = (?)
          AND CONVERSATION_ID NOT IN (?)
      LIMIT 3;
    `;
        const data = yield (0, query_1.default)(sqlGetConversation, [conversation_id, ids]);
        res.status(200).send({ chats: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getMessage = getMessage;
const getUserConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.query;
        const { conversations } = req.body;
        const ids = conversations.length ? conversations : 0;
        const sql = `
      SELECT 
        C.*, 
        U.USER_ID, 
        U.USERNAME, 
        U.FIRST_NAME, 
        U.LAST_NAME, 
        U.AVATAR_URL 
      FROM 
        CONVERSATIONS C 
        LEFT JOIN USERS U ON U.USER_ID = 
        CASE 
          WHEN C.USER_ONE = (?) THEN C.USER_TWO 
          ELSE C.USER_ONE 
        END 
      WHERE 
        CONVERSATION_ID NOT IN (?) 
      LIMIT 
        10;
    `;
        const data = yield (0, query_1.default)(sql, [user_id, ids]);
        if (!data)
            return res.status(200).send({ list: data });
        return res.status(200).send({ list: data });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "An error occurred", error: error.message });
    }
});
exports.getUserConversations = getUserConversations;
const newMessageAndConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender_id, receiver_id, text_message, conversation_id } = req.body;
        const sqlFindConversationId = "SELECT * FROM CONVERSATIONS WHERE CONVERSATION_ID = (?);";
        const [getConversationIdData] = yield (0, query_1.default)(sqlFindConversationId, [conversation_id]);
        if (!getConversationIdData) {
            const sqlInsertNewConversation = `
        INSERT INTO CONVERSATIONS (USER_ONE, USER_TWO) VALUES (?, ?);
        SET @LAST_ID_IN_CONVERSATION = LAST_INSERT_ID();
        INSERT INTO MESSAGES (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, @LAST_ID_IN_CONVERSATION, ?);
      `;
            yield (0, query_1.default)(sqlInsertNewConversation, [sender_id, receiver_id, sender_id, text_message]);
            return res.status(200).send({ message: "New conversation and message created" });
        }
        else {
            const sqlInsertNewMessage = "INSERT INTO MESSAGES  (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, ?, ?);";
            yield (0, query_1.default)(sqlInsertNewMessage, [sender_id, conversation_id, text_message]);
            return res.status(200).send({ message: "New message created" });
        }
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.newMessageAndConversation = newMessageAndConversation;
