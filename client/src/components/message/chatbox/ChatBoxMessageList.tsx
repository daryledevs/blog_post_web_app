import React from "react";
import { selectMessage }        from "@/redux/slices/messageSlice";
import { useAppSelector }       from "@/hooks/reduxHooks";
import { useGetUserDataQuery }  from "@/redux/api/userApi";
import ChatBoxMessage           from "./ChatBoxMessageCard";
import ChatBoxStartConversation from "./ChatBoxStartConversation";

type ChatBoxMessageListProps = {
  isLoading: boolean;
  chatListRef: React.RefObject<HTMLDivElement> | null;
  comingMessage: any;
  observerRef: (node?: Element | null | undefined) => void;
};

function ChatBoxMessageList({
  isLoading,
  comingMessage,
  observerRef,
  chatListRef,
}: ChatBoxMessageListProps) {
  const messages = useAppSelector(selectMessage);
  const username = messages.openConversation?.[0]?.username;
  const userDataApi = useGetUserDataQuery({ person: "" });

  const classNameChecker = (user_id: any) => {
    return user_id === userDataApi?.data?.user.user_id ? "own" : "other";
  };

  return (
    <div className="chat-message-list">
      <div
        ref={observerRef}
        className="chat-message-list-observer"
      />
      {comingMessage.length ? (
        <React.Fragment>
          {comingMessage?.map((data: any, index: number) => (
            <ChatBoxMessage
              key={data.message_id}
              observerRef={observerRef}
              text_message={data?.text_message}
              value={classNameChecker(data.sender_id)}
            />
          ))}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {isLoading ? (
            <div style={{ width: "100%", textAlign: "center" }}>Loading...</div>
          ) : (
            <ChatBoxStartConversation username={username} />
          )}
        </React.Fragment>
      )}
      <div ref={chatListRef} />
    </div>
  );
}

export default ChatBoxMessageList;
