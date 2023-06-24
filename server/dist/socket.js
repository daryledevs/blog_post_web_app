"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socketIO = new socket_io_1.Server(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
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
    socketIO.on("connection", (socket) => {
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            socket.emit("getUsers", users);
        });
        socket.on("sendMessage", ({ conversation_id, senderId, receiverId, text }) => {
            const user = getUser(receiverId);
            if (user === null || user === void 0 ? void 0 : user.socketId) {
                socket.to(user.socketId).emit("getMessage", {
                    conversation_id,
                    senderId,
                    text,
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
