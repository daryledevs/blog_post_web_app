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
const isObjEmpty_1 = __importDefault(require("../util/isObjEmpty"));
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
        const [data] = yield (0, query_1.default)(sql, [...values]);
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
        let main_arr = [];
        const length = parseInt(req.params.length);
        const limit = length + 4;
        const values = Array(5).fill(req.params.user_id);
        const sql = `
      SELECT * FROM CONVERSATIONS WHERE USER_ONE = (?) OR USER_TWO = (?);
      SELECT 
        C.CONVERSATION_ID,
        M.MESSAGE_ID,
        C.USER_ONE,
        M.SENDER_ID,
        M.TEXT_MESSAGE,
        C.USER_TWO,
        U.USERNAME,
        U.FIRST_NAME,
        U.LAST_NAME,
        M.TIME_SENT
      FROM
        MESSAGES M
      LEFT JOIN
        CONVERSATION C ON C.CONVERSATION_ID = M.CONVERSATION_ID
      INNER JOIN
        USERS U ON U.USER_ID = 
          CASE 
            WHEN C.USER_ONE = (?) THEN C.USER_TWO
            ELSE C.USER_ONE
          END 
      WHERE 
        C.USER_ONE = (?) OR C.USER_TWO = (?);
    `;
        const [data] = yield (0, query_1.default)(sql, [...values]);
        if ((0, isObjEmpty_1.default)(data))
            return res.status(200).send({ data: data });
        for (const dataOne in data[0]) {
            let sub_arr = [];
            for (const dataTwo in data[1]) {
                const isEqual = data[0][dataOne].conversation_id === data[1][dataTwo].conversation_id;
                if (isEqual)
                    sub_arr.push(data[1][dataTwo]);
            }
            main_arr.push(sub_arr);
        }
        return res.status(200).send({ data: main_arr });
    }
    catch (error) {
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
    ;
});
exports.getAllChats = getAllChats;
const newConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender_id, receiver_id, text_message } = req.body;
        const sql = `
      INSERT INTO CONVERSATIONS 
      (SENDER_ID, RECEIVER_ID) VALUES (?);

      INSERT INTO MESSAGES 
      (SENDER_ID, CONVERSATION_ID, TEXT_MESSAGE) VALUES (?, LAST_INSERT_ID(), ?);
    `;
        const [data] = yield (0, query_1.default)(sql, [
            [sender_id, receiver_id],
            sender_id,
            text_message,
        ]);
        res
            .status(200)
            .send({ message: "New conversation created", data: data[0].insertId });
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
        const [data] = yield (0, query_1.default)(sql, [req.params.conversation_id]);
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
