"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllConversation = exports.newMessage = exports.getMessage = exports.newConversation = void 0;
const database_1 = __importDefault(require("../database"));
const getAllConversation = (req, res) => {
    const sql = "SELECT * FROM conversations WHERE sender_id = (?)";
    database_1.default.query(sql, [req.params.sender_id, req.params.receiver_id], (error, data) => {
        if (error)
            res.status(500).send({ message: error });
        return res.status(200).send({ hist: data });
    });
};
exports.getAllConversation = getAllConversation;
const newConversation = (req, res) => {
    const sql = "INSERT INTO conversations (`sender_id`, `receiver_id`, `time_conversation`) VALUES (?, ?, ?, ?)";
    const time_conversation = new Date();
    const { sender_id, receiver_id } = req.body;
    database_1.default.query(sql, [sender_id, receiver_id, time_conversation], (error, data) => {
        if (error)
            res.status(500).send({ message: error });
        return res.status(200).send({ message: "New conversation created" });
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
    const sql = "INSERT INTO messages (`sender_id`, `text_message`, `time_send`, `conversation_id`) VALUES (?, ?, ?, ?)";
    const time_send = new Date();
    const { sender_id, text_message, conversation_id } = req.body;
    database_1.default.query(sql, [sender_id, text_message, time_send, conversation_id], (error, data) => {
        if (error)
            res.status(500).send({ message: error });
        return res.status(200).send({ message: "New message created" });
    });
};
exports.newMessage = newMessage;
