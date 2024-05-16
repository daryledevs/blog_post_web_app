import { useEffect, useState, useRef } from "react";
import ChatBoxSubmission               from "./ChatBoxSubmission";
import ChatBoxMessageList              from "./ChatBoxMessageList";

import { useGetUserDataQuery }         from "@/redux/api/userApi";
import { selectMessage }               from "@/redux/slices/messageSlice";

import { useAppSelector }              from "@/hooks/reduxHooks";
import useFetchMessage                 from "@/hooks/useFetchMessage";
import useAdjustInputHeight            from "@/hooks/useAdjustInputHeight";
import useSendMessageHandler           from "@/hooks/useSendMessage";

import SocketService                   from "@/services/SocketServices";

interface IEChatProps {
  socketService: SocketService | null;
}

function ChatBox({ socketService }: IEChatProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { openConversation } = useAppSelector(selectMessage);

  // data
  const userDataApi = useGetUserDataQuery({ person: ""});
  const [newMessage, setNewMessage] = useState<any>();

  // trigger
  const [clearMessage, setClearMessage] = useState<boolean>(false);

  // custom hooks
  useAdjustInputHeight({ inputRef, newMessage, clearMessage });
  
  const { comingMessage, setComingMessage, isLoading } = useFetchMessage({
    socketService,
    openConversation,
  });

  const sendMessageHandler = useSendMessageHandler({
    userDataApi: userDataApi.data?.user,
    openConversation,
    clearMessage,
    newMessage,
    socketService,
    setClearMessage,
    setComingMessage,
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
    <div className="chat-box">
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
