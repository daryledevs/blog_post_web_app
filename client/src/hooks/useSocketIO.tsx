import socketIO from "socket.io-client";

type Message = {
  sender_id: number;
  receiver_id: number;
  conversation_id: number;
  text_message: string;
}

type MessageReceived = (message: Message) => void;

const useSocket = (url:string) => {
  const socket = socketIO(url);

  const addUserId = (userId:any) => socket.emit("add-user", userId);

  const sendMessage = (message:Message) => socket.emit("send-message", message);
  
  const onMessageReceived = (callback:MessageReceived) => socket.on("get-message", callback);

  const onConnection = () => {
    socket.on("connect", () => console.log("Connection:", socket.connected, "socket id:", socket.id));
  }

  const onDisconnect = () => {
    console.log("DISCONNECTED");
    socket.disconnect();
  }

  return { onConnection, onDisconnect, addUserId, sendMessage, onMessageReceived };
};

export default useSocket;
