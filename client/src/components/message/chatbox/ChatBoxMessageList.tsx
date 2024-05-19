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
      {comingMessage.length ? (
        comingMessage?.map((data: any, index: number) => (
          <ChatBoxMessage
            key={data.message_id}
            isLoading={isLoading}
            observerRef={observerRef}
            text_message={data?.text_message}
            value={classNameChecker(data.sender_id)}
          />
        ))
      ) : (
        <ChatBoxStartConversation username={username} />
      )}
      <div ref={chatListRef} />
    </div>
  );
}

export default ChatBoxMessageList;
