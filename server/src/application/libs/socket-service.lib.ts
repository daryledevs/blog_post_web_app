import { Socket, Server } from "socket.io";
import ApiErrorException  from "@/application/exceptions/api.exception";

class SocketService {
  private users: { userUuid: string; socketId: any }[] = [];

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
    socket.on("add-user", (userUuid: string) => {
      this.addUser(userUuid, socket.id);
      socket.emit("get-users", this.users);
    });

    socket.on(
      "send-message",
      ({ conversationUuid, senderUuid, receiverUuid, textMessage }) => {
        const user = this.getUser(receiverUuid);
        if (user?.socketId) {
          socket.to(user.socketId).emit("get-message", {
            conversationUuid,
            senderUuid,
            receiverUuid,
            textMessage,
          });
        }
      }
    );

    socket.on("disconnect", () => {
      this.removeUser(socket.id);
    });
  }

  private addUser = async (userUuid: string, socketId: any) => {
    try {
      if (userUuid === null || userUuid === undefined) {
        throw ApiErrorException.HTTP400Error("User ID is required");
      }

      if (!this.users.some((user) => user.userUuid === userUuid)) {
        this.users.push({ userUuid, socketId });
      }
    } catch (error) {
      throw ApiErrorException.HTTP500Error(error as unknown as string);
    }
  };

  private removeUser(socketId: any) {
    this.users = this.users.filter((user) => user.socketId !== socketId);
  }

  private getUser(userUuid: string) {
    return this.users?.find((user) => user.userUuid === userUuid);
  }
}

export default SocketService;
