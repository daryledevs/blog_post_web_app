"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SocketService {
    users = [];
    connection(io) {
        return new Promise((resolve, reject) => {
            io.on("connection", (socket) => {
                this.onConnect(socket);
                resolve();
            }).on("error", (error) => {
                console.error(`Socket error: ${error}`);
                reject(error);
            });
        });
    }
    onConnect(socket) {
        socket.on("add-user", (userId) => {
            this.addUser(userId, socket.id);
            socket.emit("get-users", this.users);
        });
        socket.on("send-message", ({ conversation_id, sender_id, receiver_id, text_message }) => {
            const user = this.getUser(receiver_id);
            if (user?.socketId) {
                socket.to(user.socketId).emit("get-message", {
                    conversation_id,
                    sender_id,
                    text_message,
                });
            }
        });
        socket.on("disconnect", () => {
            this.removeUser(socket.id);
        });
    }
    addUser(userId, socketId) {
        !this.users.some((user) => user.userId === userId) &&
            this.users.push({ userId, socketId });
    }
    removeUser(socketId) {
        this.users = this.users.filter((user) => user.socketId !== socketId);
    }
    getUser(userId) {
        return this.users.find((user) => user.userId === userId);
    }
}
;
exports.default = SocketService;
