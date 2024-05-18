import { useState, useRef } from "react";
import ChatBoxSubmission    from "./ChatBoxSubmission";
import ChatBoxMessageList   from "./ChatBoxMessageList";
import { useInView }        from "react-intersection-observer";

import { selectMessage }    from "@/redux/slices/messageSlice";
import { useAppSelector }   from "@/hooks/reduxHooks";
import useFetchMessage      from "@/hooks/useFetchMessage";
import useAdjustInputHeight from "@/hooks/useAdjustInputHeight";
import useSendMessage       from "@/hooks/useSendMessage";
import SocketService        from "@/services/SocketServices";

interface IEChatProps {
  socketService: SocketService | null;
}

function ChatBox({ socketService }: IEChatProps) {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { openConversation } = useAppSelector(selectMessage);

  const [newMessage, setNewMessage] = useState<any>();
  useAdjustInputHeight({ inputRef, newMessage });

  const { ref, inView, } = useInView({
    threshold: 0,
  });
  
  const { comingMessage, setComingMessage, isLoading } = useFetchMessage({
    inView,
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

  if (isLoading) return null;

  return (
    <div className="chat-box">
      <ChatBoxMessageList
        observerRef={ref}
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
