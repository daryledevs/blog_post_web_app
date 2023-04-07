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
    let getData = [];
    let main_arr = [];
    const limit = length + 4;
    const sql = `
                SELECT * FROM conversations WHERE user_one = (?);
                SELECT 
                    c.conversation_id,
                    m.message_id,
                    c.user_one,
                    m.sender_id,
                    m.text_message,
                    c.user_two,
                    u.username,
                    u.first_name,
                    u.last_name,
                    m.time_sent
                FROM
                    messages m
                LEFT JOIN
                    conversations c ON c.conversation_id = m.conversation_id
                INNER JOIN
                    users u ON u.user_id = c.user_two
                WHERE 
                  c.user_one = (?) OR c.user_two = (?)
                ORDER BY c.conversation_id ASC;
            `;
    database_1.default.query(sql, [
        [req.params.user_one],
        req.params.user_one, req.params.user_one
    ], (error, data) => {
        if (error)
            res.status(500).send({ message: error });
        if (data.length === 0)
            res.status(200).send({ data: data });
        for (let i = 0; i < data[0].length; i++) {
            let sub_arr = [];
            for (let j = 0; j < data[1].length; j++) {
                if (data[0][i].conversation_id === data[1][j].conversation_id)
                    sub_arr.push(data[1][j]);
            }
            main_arr.push(sub_arr);
        }
        // will continue on this part next time
        // we provide only 5 chat's per request to divide the data and prevent the long query
        // for (let i = length; i < limit; i++) {
        //   if (length > limit || data.length <= length + i) break;
        //   else getData.push(data[i]);
        // }
        return res.status(200).send({ data: main_arr });
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
