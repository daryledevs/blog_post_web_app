import React                    from "react";

import { MessageType }          from "@/interfaces/interface";
import { useAppSelector }       from "@/hooks/reduxHooks";
import { useGetUserDataQuery }  from "@/redux/api/userApi";
import { selectMessage }        from "@/redux/slices/messageSlice";

import ChatBoxMessage           from "./ChatBoxMessageCard";
import ChatBoxStartConversation from "./ChatBoxStartConversation";

type ChatBoxMessageListProps = {
  isLoading: boolean;
  chatListRef: React.RefObject<HTMLDivElement> | null;
  comingMessage: MessageType[];
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
  const userDataApi = useGetUserDataQuery();

  const classNameChecker = (
    senderUuid: string,
    receiverUuid: string
  ): string => {
    const myUserUuid = userDataApi?.data?.user?.uuid;
    return senderUuid === receiverUuid || receiverUuid === myUserUuid
      ? "other"
      : "own";
  };

  return (
    <div className="chat-message-list">
      <div
        ref={observerRef}
        className="chat-message-list-observer"
      />
      {comingMessage.length ? (
        <React.Fragment>
          {comingMessage?.map((message: MessageType, index: number) => (
            <ChatBoxMessage
              key={index}
              observerRef={observerRef}
              text_message={message?.textMessage}
              value={classNameChecker(
                message?.senderUuid,
                message?.receiverUuid
              )}
            />
          ))}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {isLoading ? (
            <div
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Loading...
            </div>
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
