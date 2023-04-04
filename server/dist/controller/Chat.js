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
exports.newMessage = exports.getMessage = exports.newConversation = exports.getAllChats = void 0;
const database_1 = __importDefault(require("../database"));
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const length = parseInt(req.params.length);
    const getData = [];
    const limit = length + 4;
    const sql = `
              SELECT 
                  m.sender_id,
                  m.text_message,
                  c.receiver_id,
                  u.username,
                  u.first_name,
                  u.last_name,
                  c.conversation_id,
                  m.time_sent
              FROM
                  messages m
                      LEFT JOIN
                  conversations c ON c.conversation_id = m.conversation_id
                      RIGHT JOIN
                  users u ON u.user_id = c.receiver_id
              WHERE
                u.user_id != m.sender_id
              ORDER BY m.time_sent ASC;
          `;
    database_1.default.query(sql, [req.params.sender_id], (error, data) => {
        if (error)
            res.status(500).send({ message: error.message });
        if (data.length === 0)
            res.status(200).send({ data: data });
        // we provide only 5 chat's per request to divide the data and prevent the long query
        for (let i = length; i < limit; i++) {
            if (length > limit || data.length <= length + i)
                break;
            else
                getData.push(data[i]);
        }
        return res.status(200).send({ data: getData });
    });
});
exports.getAllChats = getAllChats;
const newConversation = (req, res) => {
    const sql = `
                INSERT INTO conversations (\`sender_id\`, \`receiver_id\`) VALUES (?);
                INSERT INTO messages (\`sender_id\`, \`conversation_id\`, \`text_message\`, \`time_sent\`) VALUES 
                (?, (SELECT LAST_INSERT_ID()), ?, ?);
              `;
    const { sender_id, receiver_id, text_message } = req.body;
    const time_sent = new Date();
    database_1.default.query(sql, [
        [sender_id, receiver_id],
        sender_id, text_message, time_sent
    ], (error, data) => {
        if (error)
            res.status(500).send({ message: error });
        return res
            .status(200)
            .send({ message: "New conversation created", data: data[0].insertId });
    });
};
exports.newConversation = newConversation;
const getMessage = (req, res) => {
    const sql = "SELECT * FROM messages WHERE conversation_id = (?)";
    database_1.default.query(sql, [req.params.conversation_id], (error, data) => {
        if (error)
            res.status(500).send({ message: error });
        return res.status(200).send({ chats: data });
    });
};
exports.getMessage = getMessage;
const newMessage = (req, res) => {
    const sql = "INSERT INTO messages (`sender_id`, `conversation_id`, `text_message`, `time_sent`) VALUES (?, ?, ?, ?)";
    const time_sent = new Date();
    const { sender_id, text_message, conversation_id } = req.body;
    database_1.default.query(sql, [sender_id, conversation_id, text_message, time_sent], (error, data) => {
        if (error)
            res.status(500).send({ message: error });
        return res.status(200).send({ message: "New message created" });
    });
};
exports.newMessage = newMessage;
