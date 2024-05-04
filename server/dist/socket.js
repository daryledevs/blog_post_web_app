"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
function socketController(socketIO) {
    socketIO.on("connect", (socket) => {
        console.log("a user connected");
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
