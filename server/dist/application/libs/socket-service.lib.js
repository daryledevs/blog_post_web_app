"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
const async_wrapper_util_1 = __importDefault(require("@/application/utils/async-wrapper.util"));
class SocketService {
    users = [];
    wrap = new async_wrapper_util_1.default();
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
    addUser = async (userId, socketId) => {
        try {
            if (userId === null || userId === undefined) {
                throw api_exception_1.default.HTTP400Error("User ID is required");
            }
            if (!this.users.some((user) => user.userId === userId)) {
                this.users.push({ userId, socketId });
            }
        }
        catch (error) {
            throw api_exception_1.default.HTTP500Error(error);
        }
    };
    removeUser(socketId) {
        this.users = this.users.filter((user) => user.socketId !== socketId);
    }
    getUser(userId) {
        return this.users?.find((user) => user.userId === userId);
    }
}
exports.default = SocketService;
