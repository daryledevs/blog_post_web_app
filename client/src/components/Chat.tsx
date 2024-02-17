import React, { useEffect, useState, useRef } from "react";
import usersPicture from "../assets/icons/avatar.png";
import emojiIcon from "../assets/icons/emoji-icon.png";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { IEOpenConversation } from "../interfaces/interface";
import { useLazyGetChatMessagesQuery } from "../redux/api/ChatApi";
import { useGetUserDataQuery } from "../redux/api/UserApi";

interface IEChatProps {
  openConversation: IEOpenConversation;
  socket: any;
}

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

function Chat({ openConversation, socket }: IEChatProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { onMessageReceived, sendMessage } = socket;

  // consume api
  const [getChatMessages, allChatMessages] = useLazyGetChatMessagesQuery();
  const [comingMessage, setComingMessage] = useState<any>([]);

  // data
  const userDataApi = useGetUserDataQuery();
  const [newMessage, setNewMessage] = useState<any>();

  // trigger
  const [clearMessage, setClearMessage] = useState<boolean>(false);
  const [emojiModalTrigger, setEmojiModalTrigger] = useState<boolean>(false);

  // functions
  const classNameChecker = (user_id: any) => {
    if(!userDataApi.data) return;
    return user_id === userDataApi?.data.user.user_id ? "own" : "other";
  };

  function chooseEmoji(emojiData: EmojiClickData, event: MouseEvent) {
    setNewMessage({
      ...newMessage,
      text_message: newMessage?.text_message + emojiData.emoji,
    });
  }

  useEffect(() => {
    onMessageReceived((message: any) => {
      setComingMessage((prev: any) => [...prev, { ...message }]);
    });
  }, [onMessageReceived]);

  useEffect(() => {
    if(allChatMessages.data) {
      setComingMessage(allChatMessages?.data?.chats);
    }
  }, [allChatMessages]);

  useEffect(() => {
    getChatMessages({ conversation_id: openConversation.conversation_id });
  }, [getChatMessages, openConversation.conversation_id]);


  useEffect(() => {
    if (messageRef.current) scrollToDown(messageRef.current);
  }, [openConversation]);

  useEffect(() => {
    if (inputRef.current) {
      if (!newMessage?.text_message) inputRef.current.style.height = "0px";
      if (inputRef.current.scrollHeight > 100) return;
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight + "px";
    }
  }, [inputRef, newMessage, clearMessage]);

  function sendMessageHandler(){
    if (!newMessage?.text_message) return;
    if (!userDataApi?.data) return;
    const user = userDataApi.data.user;
    const { user_two, user_one, conversation_id } = openConversation;
    const receiver_id = user_one !== user.user_id ? user_one : user_two;

    const data = {
      sender_id: userDataApi.data.user.user_id,
      receiver_id: receiver_id,
      conversation_id: conversation_id,
      text_message: newMessage.text_message,
    };

    const { receiver_id: _, ...rest } = data;
    
    sendMessage(data);
    setComingMessage((prev: any) => [...prev, { ...rest }]);
    setClearMessage(!clearMessage);
  }

  if (allChatMessages.isLoading || !userDataApi.data) return null;

  return (
    <div className="chat__container">
      <div
        className="chat__message-list"
        ref={messageRef}
      >
        {comingMessage?.map((data: any, index: number) => {
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
            sendMessageHandler();
          }}
        ></textarea>
        <button
          className="chat__input-box-btn"
          onClick={sendMessageHandler}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
