import { Server } from "socket.io";
import { Socket } from "socket.io";

const socketIO = new Server(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users: any[] = [];

const addUser = (userId: any, socketId: any) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId: any) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId: any) => {
  return users.find((user) => user.userId === userId);
};

function socketController() {
  socketIO.on("connection", (socket: Socket) => {
    console.log("a user connected");
    // socket.emit("Welcome", "Hello this is socket server!");

    socket.on("addUser", (userId) => {
      console.log("ADD USER");
      addUser(userId, socket.id);
      socket.emit("getUsers", users);
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      socket.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      removeUser(socket.id);
    });
  });
};

export default socketController;