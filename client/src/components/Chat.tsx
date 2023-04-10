import React, { useEffect, useState, useRef } from "react";
import usersPicture from "../assets/icons/avatar.png";
import { useAppSelector } from "../redux/hooks/hooks";
import { addMessage } from "../redux/reducer/chat";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

interface IEChatProps {
  openConversation: any;
}

function Chat({ openConversation }: IEChatProps) {
  const socket = useRef(io("ws://localhost:8900"));
  const dispatch = useDispatch();

  // data
  const chats = useAppSelector((state) => state.chat);
  const userData = useAppSelector((state) => state.user);
  const getData = chats.find( (chat: any) => chat[0].conversation_id === openConversation);
  const messageData = getData?.[0];

  const [newMessage, setNewMessage] = useState<any>();
  const [clearMessage, setClearMessage] = useState<boolean>(false);

  // functions
  const classNameChecker = (user_id: any) => user_id === userData.user_id ? "own" : "other";
  const getReceiverId = () => getData?.[0].user_one !== userData.user_id ? getData?.[0].user_one : getData?.[0].user_two;
  
  useEffect(() => {
    setNewMessage(() => {
      return {
        conversation_id: openConversation,
        first_name: messageData?.first_name,
        last_name: messageData?.last_name,
        sender_id: userData.user_id,
        text_message: "",
        user_one: messageData?.user_one,
        user_two: messageData?.user_two,
        username: messageData?.username,
      };
    });
  }, [openConversation, clearMessage]);

  const submitHandler = () => {

    dispatch(addMessage(newMessage));

    socket.current.emit("sendMessage", {
      conversation_id: openConversation,
      senderId: newMessage.sender_id,
      receiverId: getReceiverId(),
      text: newMessage.text_message,
    });

    setClearMessage(!clearMessage);
  };

  return (
    <>
      {getData?.map((data: any, index: number) => {
        let value = classNameChecker(data?.sender_id);
        // let time_sent = new Date(data.time_sent).getHours();
        return (
          <div
            className={`chat__container-${value}`}
            key={index + 1}
          >
            <div className={`chat__viewed-conversation-${value}`}>
              <div className={`chat__message-container-${value}`}>
                <img
                  src={usersPicture}
                  className={`chat__user-picture-${value}`}
                />
                <p className={`chat__user-message-${value}`}>
                  {data?.text_message}
                </p>
              </div>
              {/* <div className={`chat__message-status-${value}`}>{time_sent}</div> */}
            </div>
          </div>
        );
      })}
      <div className="chat__test">
        <textarea
          className="input-box"
          value={newMessage?.text_message}
          onChange={(event: any) =>
            setNewMessage({ ...newMessage, text_message: event.target.value })
          }
        ></textarea>
        <button
          className="input-box-enter"
          onClick={submitHandler}
        >
          Send
        </button>
      </div>
    </>
  );
}

export default Chat;
