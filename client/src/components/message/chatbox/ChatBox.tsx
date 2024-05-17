import { useEffect, useState, useRef } from "react";
import ChatBoxSubmission               from "./ChatBoxSubmission";
import ChatBoxMessageList              from "./ChatBoxMessageList";

import { useGetUserDataQuery }         from "@/redux/api/userApi";
import { selectMessage }               from "@/redux/slices/messageSlice";

import { useAppSelector }              from "@/hooks/reduxHooks";
import useFetchMessage                 from "@/hooks/useFetchMessage";
import useAdjustInputHeight            from "@/hooks/useAdjustInputHeight";
import useSendMessage           from "@/hooks/useSendMessage";

import SocketService                   from "@/services/SocketServices";

interface IEChatProps {
  socketService: SocketService | null;
}

function ChatBox({ socketService }: IEChatProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { openConversation } = useAppSelector(selectMessage);

  const [newMessage, setNewMessage] = useState<any>();
  useAdjustInputHeight({ inputRef, newMessage });
  
  const { comingMessage, setComingMessage, isLoading } = useFetchMessage({
    socketService,
    openConversation,
  });

  const sendMessageHandler = useSendMessage({
    openConversation,
    newMessage,
    socketService,
    setComingMessage,
    setNewMessage,
  });

  useEffect(() => {
    if (messageRef.current) scrollToDown(messageRef.current);
  }, [openConversation]);

  function scrollToDown(ref:any){
    const scrollHeight = ref.scrollHeight;
    ref.scrollTop = scrollHeight;
  }

  if (isLoading) return null;

  return (
    <div className="chat-box">
      <ChatBoxMessageList
        messageRef={messageRef}
        comingMessage={comingMessage}
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
