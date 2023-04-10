import React, { useState } from "react";
import Chat from "../components/Chat";
import { useAppSelector } from "../redux/hooks/hooks";
import usersPicture from "../assets/icons/avatar.png";
import downArrow from "../assets/icons/down-arrow.png";
import newMessage from "../assets/icons/editing.png";

function Message() {
  const [openConversation, setOpenConversation] = useState(null);

  function ChatList() {
    const chats = useAppSelector((state) => state.chat);
    const user = useAppSelector((state) => state.user);

    return (
      <div className="chat-history__container">
        {chats.map((chat: any, index: number) => {
          console.log("CHATS: ", chat);
          return (
            <div
              key={chat?.[0]?.conversation_id}
              className="chat-history__recipient"
              onClick={() => setOpenConversation(chat?.[0]?.conversation_id)}
            >
              <img
                src={usersPicture}
                width="10.6%"
                height="29"
              />
              <div className="chat-history__details">
                <p>
                  {chat?.[0]?.first_name} {chat?.[0]?.last_name}
                </p>
                <p>
                  {chat?.[chat.length - 1]?.sender_id === user.user_id &&
                    "You: "}
                  {chat?.[chat.length - 1]?.text_message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function ChatHeader() {
    return (
      <div className="chat-header__container">
        <div />
        <div className="chat-header__username">
          <p>username</p>
          <img
            src={downArrow}
            className="chat-header__username-icon"
          />
        </div>
        <img
          src={newMessage}
          className="chat-header__new-message-icon"
        />
      </div>
    );
  }

  return (
    <div className="message__container">
      <div className="message__parent">
        <div className="message__sidebar">
          <ChatHeader />
          <ChatList />
        </div>
        <div className="message__conversation-container">
          {openConversation ? (
            <>
              <Chat openConversation={openConversation} />
            </>
          ) : (
            <p className="message__not-viewed">
              open a conversation to start a chat.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
