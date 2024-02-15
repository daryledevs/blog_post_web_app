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
exports.getAllChatMember = exports.newMessage = exports.getMessage = exports.newConversation = exports.getAllChats = void 0;
const query_1 = __importDefault(require("../database/query"));
const getAllChatMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const values = Array(3).fill(user_id);
        const sql = `
      SELECT 
        C.*,
        U.USERNAME,
        U.FIRST_NAME,
        U.LAST_NAME
      FROM
        CONVERSATIONS C
      INNER JOIN
        USERS U ON U.USER_ID = 
        CASE
          WHEN C.USER_ONE = (?) THEN C.USER_TWO
          ELSE C.USER_ONE
        END
      WHERE
        C.USER_ONE = (?) OR C.USER_TWO = (?);
    `;
        const data = yield (0, query_1.default)(sql, [...values]);
        res.status(200).send({ list: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getAllChatMember = getAllChatMember;
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req.params;
        const conversation_id = req.query.conversation_id ? req.query.conversation_id.split(',') : 0;
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
        const data = yield (0, query_1.default)(sql, [user_id, conversation_id]);
        if (!data)
            return res.status(200).send({ data: data });
        return res.status(200).send({ data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getAllChats = getAllChats;
const newConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender_id, receiver_id } = req.body;
        const sql = "INSERT INTO CONVERSATIONS (USER_ONE, USER_TWO) VALUES (?, ?);";
        const data = yield (0, query_1.default)(sql, [sender_id, receiver_id]);
        res
            .status(200)
            .send({ message: "New conversation created", data: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.newConversation = newConversation;
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `
      SELECT * FROM MESSAGES 
      WHERE CONVERSATION_ID = (?);
    `;
        const data = yield (0, query_1.default)(sql, [req.params.conversation_id]);
        res.status(200).send({ chats: data });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getMessage = getMessage;
const newMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `
      INSERT INTO MESSAGES 
      (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, ?, ?);
    `;
        const { sender_id, text_message, conversation_id } = req.body;
        const data = yield (0, query_1.default)(sql, [sender_id, conversation_id, text_message]);
        res.status(200).send({ message: "New message created" });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.newMessage = newMessage;
