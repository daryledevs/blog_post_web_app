import { Socket, Server } from "socket.io";

class SocketController {
  private users: { userId: any; socketId: any }[] = [];

  public connection(io: Server): Promise<void> {
    return new Promise((resolve, reject) => {
      io.on("connection", (socket: Socket) => {
        this.onConnect(socket);
        resolve();
      }).on("error", (error: Error) => {
        console.error(`Socket error: ${error}`);
        reject(error);
      });
    });
  }

  private onConnect(socket: Socket) {
    socket.on("add-user", (userId: string) => {
      this.addUser(userId, socket.id);
      socket.emit("get-users", this.users);
    });

    socket.on(
      "send-message",
      ({ conversation_id, sender_id, receiver_id, text_message }) => {
        const user = this.getUser(receiver_id);
        if (user?.socketId) {
          socket.to(user.socketId).emit("get-message", {
            conversation_id,
            sender_id,
            text_message,
          });
        }
      }
    );

    socket.on("disconnect", () => {
      this.removeUser(socket.id);
    });
  }

  private addUser(userId: any, socketId: any) {
    !this.users.some((user) => user.userId === userId) &&
      this.users.push({ userId, socketId });
  }

  private removeUser(socketId: any) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  private getUser(userId: any) {
    return this.users.find((user) => user.userId === userId);
  }
};

export default SocketController;
