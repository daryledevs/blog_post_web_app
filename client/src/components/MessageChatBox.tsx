import React from 'react'
import Chat from "./Chat";


type MessageChatBoxProps = {
  openConversation: string;
  setOpenConversation: (id: string) => void;
};

function MessageChatBox({ openConversation, setOpenConversation, }: MessageChatBoxProps) {
  return (
    <div className="message__conversation-container">
      {openConversation ? (
        <Chat openConversation={openConversation} />
      ) : (
        <p className="message__not-viewed">
          open a conversation to start a chat.
        </p>
      )}
    </div>
  );
}

export default MessageChatBox;
