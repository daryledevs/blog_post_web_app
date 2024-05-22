import { useState, useRef, useEffect } from "react";
import { useInView }        from "react-intersection-observer";

import ChatBoxSubmission    from "./ChatBoxSubmission";
import ChatBoxMessageList   from "./ChatBoxMessageList";

import useFetchMessage      from "@/hooks/useFetchMessage";
import useAdjustInputHeight from "@/hooks/useAdjustInputHeight";
import useSendMessage       from "@/hooks/useSendMessage";
import SocketService        from "@/services/SocketServices";

interface IEChatProps {
  socketService: SocketService | null;
}

function ChatBox({ socketService }: IEChatProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatListRef = useRef<HTMLDivElement | null>(null);
  const [newMessage, setNewMessage] = useState<any>();
  useAdjustInputHeight({ inputRef, newMessage });

  const { ref, inView } = useInView({
    threshold: 0,
  });
  
  const { comingMessage, setComingMessage, isLoading } =
    useFetchMessage({
      inView,
      chatListRef,
      socketService,
    });

  const sendMessageHandler = useSendMessage({
    newMessage,
    socketService,
    setComingMessage,
    setNewMessage,
  });

  return (
    <div className="chat-box">
      <ChatBoxMessageList
        observerRef={ref}
        isLoading={isLoading}
        chatListRef={chatListRef}
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
