import { Server } from "socket.io";
import { Socket } from "socket.io";

const socketIO = new Server(8900, {
  cors: {
    origin: [
      `${process.env.SERVER_URL_ONE}`,
      `${process.env.SERVER_URL_TWO}`,
      `${process.env.SERVER_URL_THREE}`,
    ],
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
  console.log("getUser: ", userId);
  return users.find((user) => user.userId === userId);
};

function socketController() {
  socketIO.on("connect", (socket: Socket) => {
    socket.on("add-user", (userId:string) => {
      addUser(userId, socket.id);
      socket.emit("get-users", users);
    });

    socket.on("send-message", ({ conversation_id, sender_id, receiver_id, text_message }) => {
      const user = getUser(receiver_id);
      if(user?.socketId){
         socket.to(user.socketId).emit("get-message", {
           conversation_id,
           sender_id,
           text_message,
         });
      };
    });

    socket.on("disconnect", () => {
      removeUser(socket.id);
    });
  });
};

export default socketController;