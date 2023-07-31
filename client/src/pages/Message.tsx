import React, { useState } from "react";
import Chat from "../components/Chat";
import { useAppSelector } from "../redux/hooks/hooks";
import usersPicture from "../assets/icons/avatar.png";
import downArrow from "../assets/icons/down-arrow.png";
import newMessage from "../assets/icons/editing.png";
import NewMessage from "../shared/modals/NewMessage";

function Message() {
  const [openConversation, setOpenConversation] = useState(null);
  const [newMessageTrgger, setNewMessageTrgger] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const chatMembers = useAppSelector((state) => state.chatMember);
  
  return (
    <React.Fragment>
      <NewMessage
        newMessageTrgger={newMessageTrgger}
        setNewMessageTrgger={setNewMessageTrgger}
      />
      <div className="message__container">
        <div className="message__parent">
          <div className="message__sidebar">
            <div className="chat-header__container">
              <div />
              <div className="chat-header__username">
                <p>{user.username}</p>
                <img
                  src={downArrow}
                  className="chat-header__username-icon"
                  alt=""
                />
              </div>
              <img
                alt=""
                src={newMessage}
                onClick={() => setNewMessageTrgger(!newMessageTrgger)}
                className="chat-header__new-message-icon"
              />
            </div>
            <div className="chat-history__container">
              {chatMembers.map((chat: any, index: number) => {
                return (
                  <div
                    key={chat.conversation_id}
                    className="chat-history__recipient"
                    onClick={() => setOpenConversation(chat?.conversation_id)}
                  >
                    <img
                      src={usersPicture}
                      width="10.6%"
                      height="29"
                      alt=""
                    />
                    <div className="chat-history__details">
                      <p>
                        {chat.name.first_name} {chat.name.last_name}
                      </p>
                      <p>
                        {chat?.[chat.length - 1]?.sender_id === user.user_id &&
                          "You: "}{" "}
                        {chat?.[chat.length - 1]?.text_message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
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
    </React.Fragment>
  );
}

export default Message;
