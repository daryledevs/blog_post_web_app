import React from 'react'
import Chat from "./Chat";
import { IEOpenConversation } from "../interfaces/interface";

type MessageChatBoxProps = {
  openConversation: IEOpenConversation | null;
  socket: any;
};

function MessageChatBox({ openConversation, socket }: MessageChatBoxProps) {
  return (
    <div className="message__conversation-container">
      {openConversation ? (
        <Chat openConversation={openConversation} socket={socket} />
      ) : (
        <p className="message__not-viewed">
          open a conversation to start a chat.
        </p>
      )}
    </div>
  );
}

export default MessageChatBox;
