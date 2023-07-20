import React, { useEffect, useState, useRef } from "react";
import usersPicture from "../assets/icons/avatar.png";
import { useAppSelector } from "../redux/hooks/hooks";
import { addMessage } from "../redux/reducer/chat";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import api from "../config/api";
import emojiIcon from "../assets/icons/emoji-icon.png";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";

interface IEChatProps {
  openConversation: any;
}

function initial(members: any, userData: any, openConversation: any) {
  return {
    conversation_id: openConversation,
    first_name: members?.name.first_name,
    last_name: members?.name.last_name,
    sender_id: userData.user_id,
    text_message: "",
    user_one: members?.members.user_one,
    user_two: members?.members.user_two,
    username: members?.username,
  };
};

const eventFilter = (event: any) => {
  return (
    (event.key !== "Enter" && event.shiftKey === false) || 
    (event.key === "Enter" && event.shiftKey === true) || 
    event.shiftKey
  );
};

const scrollToDown = (ref:any) => {
  const scrollHeight = ref.scrollHeight;
  ref.scrollTop = scrollHeight;
};

function Chat({ openConversation }: IEChatProps) {
  const dispatch = useDispatch();
  const socket = useRef(io("ws://localhost:8900"));
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // data
  const chats = useAppSelector((state) => state.chat);
  const userData = useAppSelector((state) => state.user);
  const chatMember = useAppSelector((state) => state.chatMember);
  const getData = chats.find( (chat: any) => chat[0]?.conversation_id === openConversation);
  const members = chatMember.find((member) => member.conversation_id === openConversation);
  const stateInitial = initial(members, userData, openConversation);
  const [newMessage, setNewMessage] = useState<any>(stateInitial);

  // trigger
  const [clearMessage, setClearMessage] = useState<boolean>(false);
  const [emojiModalTrigger, setEmojiModalTrigger] = useState<boolean>(false);

  // functions
  const classNameChecker = (user_id: any) => user_id === userData.user_id ? "own" : "other";
  const getReceiverId = () => {
    return members?.members.user_one === userData.user_id
      ? members?.members.user_two
      : members?.members.user_one;
  };
  
  useEffect(() => {
    setNewMessage(stateInitial);
  }, [openConversation, clearMessage]);

  useEffect(() => {
    if (messageRef.current) {
      scrollToDown(messageRef.current);
    }
  }, [openConversation]);
  
  useEffect(() => {
    if (inputRef.current) {
      if(!newMessage.text_message) inputRef.current.style.height = "0px";
      if(inputRef.current.scrollHeight > 100) return;
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight + "px";
    }
  }, [inputRef, newMessage, clearMessage]);

  const submitHandler = async () => {
    dispatch(addMessage(newMessage));

    socket.current.emit("sendMessage", {
      conversation_id: openConversation,
      senderId: newMessage.sender_id,
      receiverId: getReceiverId(),
      text: newMessage.text_message,
    });

    try {
      await api.post("/chats/message", {
        conversation_id: openConversation,
        sender_id: newMessage.sender_id,
        text_message: newMessage.text_message,
      });
    } catch (error) {
      console.log(error.message);
    }

    setClearMessage(!clearMessage);
    scrollToDown(messageRef.current);
  };

  function chooseEmoji(emojiData: EmojiClickData, event: MouseEvent) {
    // setSelectedEmoji(emojiData.unified);
    setNewMessage({
      ...newMessage,
      text_message: newMessage.text_message + emojiData.emoji,
    });
  }

  return (
    <div className="chat__container">
      <div className="chat__message-list" ref={messageRef}>
        {getData?.map((data: any, index: number) => {
          let value = classNameChecker(data?.sender_id);
          // let time_sent = new Date(data.time_sent).getHours();
          return (
            <div
              className={`chat__${value}-container`}
              key={index + 1}
            >
              <div className={`chat__${value}-message`}>
                <img
                  src={usersPicture}
                  className={`chat__${value}-picture`}
                  alt=""
                />
                <p className={`chat__${value}-text`}>{data?.text_message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat__input-container">
        <div className="chat__emoji-container">
          <img
            src={emojiIcon}
            onClick={() => setEmojiModalTrigger(!emojiModalTrigger)}
            className="chat__emoji-modal"
            alt=""
          />
          {emojiModalTrigger && (
            <div className="chat__emoji-parent">
              <EmojiPicker
                onEmojiClick={chooseEmoji}
                autoFocusSearch={false}
                theme={Theme.AUTO}
              />
            </div>
          )}
        </div>
        <textarea
          rows={1}
          ref={inputRef}
          className="chat__input-box"
          value={newMessage?.text_message}
          onChange={(event: any) =>
            setNewMessage({ ...newMessage, text_message: event.target.value })
          }
          onKeyDown={(event) => {
            if (eventFilter(event)) return;
            submitHandler();
          }}
        ></textarea>
        <button
          className="chat__input-box-btn"
          onClick={submitHandler}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
