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
    console.log("getUser: ", userId);
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
            if (user === null || user === void 0 ? void 0 : user.socketId) {
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
