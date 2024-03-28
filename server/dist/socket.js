"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const index_1 = __importDefault(require("./index"));
const socketIO = new socket_io_1.Server(index_1.default, {
    cors: {
        origin: [
            `${process.env.SERVER_URL_ONE}`,
            `${process.env.SERVER_URL_TWO}`,
            `${process.env.SERVER_URL_THREE}`,
        ],
    },
    path: `${process.env.API}/socket`,
});
let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
function socketController() {
    socketIO.on("connect", (socket) => {
        socket.on("add-user", (userId) => {
            addUser(userId, socket.id);
            socket.emit("get-users", users);
        });
        socket.on("send-message", ({ conversation_id, sender_id, receiver_id, text_message }) => {
            const user = getUser(receiver_id);
            if (user?.socketId) {
                socket.to(user.socketId).emit("get-message", {
                    conversation_id,
                    sender_id,
                    text_message,
                });
            }
            ;
        });
        socket.on("disconnect", () => {
            removeUser(socket.id);
        });
    });
}
;
exports.default = socketController;
