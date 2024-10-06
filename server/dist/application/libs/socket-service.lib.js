"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = __importDefault(require("@/application/exceptions/api.exception"));
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
        socket.on("add-user", (userUuid) => {
            this.addUser(userUuid, socket.id);
            socket.emit("get-users", this.users);
        });
        socket.on("send-message", ({ conversationUuid, senderUuid, receiverUuid, textMessage }) => {
            const user = this.getUser(receiverUuid);
            if (user?.socketId) {
                socket.to(user.socketId).emit("get-message", {
                    conversationUuid,
                    senderUuid,
                    receiverUuid,
                    textMessage,
                });
            }
        });
        socket.on("disconnect", () => {
            this.removeUser(socket.id);
        });
    }
    addUser = async (userUuid, socketId) => {
        try {
            if (userUuid === null || userUuid === undefined) {
                throw api_exception_1.default.HTTP400Error("User ID is required");
            }
            if (!this.users.some((user) => user.userUuid === userUuid)) {
                this.users.push({ userUuid, socketId });
            }
        }
        catch (error) {
            throw api_exception_1.default.HTTP500Error(error);
        }
    };
    removeUser(socketId) {
        this.users = this.users.filter((user) => user.socketId !== socketId);
    }
    getUser(userUuid) {
        return this.users?.find((user) => user.userUuid === userUuid);
    }
}
exports.default = SocketService;
