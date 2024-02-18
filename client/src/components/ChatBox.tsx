import React, { useEffect, useState, useRef } from "react";
import { IEOpenConversation } from "../interfaces/interface";
import { useGetUserDataQuery } from "../redux/api/UserApi";
import useAdjustInputHeight from "../hooks/useAdjustInputHeight";
import useFetchMessage from "../hooks/useFetchMessage";
import ChatBoxSubmission from "./ChatBoxSubmission";
import ChatBoxMessageList from "./ChatBoxMessageList";
import useSendMessageHandler from "../hooks/useSendMessage";

interface IEChatProps {
  openConversation: IEOpenConversation;
  socket: any;
}

function ChatBox({ openConversation, socket }: IEChatProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // data
  const userDataApi = useGetUserDataQuery();
  const [newMessage, setNewMessage] = useState<any>();

  // trigger
  const [clearMessage, setClearMessage] = useState<boolean>(false);

  // custom hooks=
  const { sendMessage } = socket;
  useAdjustInputHeight({ inputRef, newMessage, clearMessage })
  const { comingMessage, setComingMessage, isLoading } = useFetchMessage({ socket, openConversation });

  const sendMessageHandler = useSendMessageHandler({
    userDataApi: userDataApi.data?.user,
    openConversation,
    clearMessage,
    setClearMessage,
    setComingMessage,
    newMessage,
    setNewMessage,
    sendMessage,
  });

  useEffect(() => {
    if (messageRef.current) scrollToDown(messageRef.current);
  }, [openConversation]);

  function scrollToDown(ref:any){
     const scrollHeight = ref.scrollHeight;
     ref.scrollTop = scrollHeight;
  }

  if (isLoading || !userDataApi.data) return null;

  return (
    <div className="chat__container">
      <ChatBoxMessageList
        messageRef={messageRef}
        comingMessage={comingMessage}
        userDataApi={userDataApi.data.user}
      />
      <ChatBoxSubmission
        inputRef={inputRef}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessageHandler={sendMessageHandler}
      />
    </div>
  );
}

export default ChatBox;
