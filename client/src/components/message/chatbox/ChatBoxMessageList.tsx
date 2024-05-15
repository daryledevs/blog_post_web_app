import ChatBoxMessage           from "./ChatBoxMessageCard";
import { selectMessage }        from "@/redux/slices/messageSlice";
import { useAppSelector }       from "@/hooks/reduxHooks";
import ChatBoxStartConversation from "./ChatBoxStartConversation";

function ChatBoxMessageList({ userDataApi, messageRef, comingMessage }: any) {
  const messages = useAppSelector(selectMessage);
  const username = messages.openConversation?.[0]?.username;

  const classNameChecker = (user_id: any) => {
    return user_id === userDataApi.user_id ? "own" : "other";
  };

  return (
    <div
      ref={messageRef}
      className="chat-message-list"
    >
      {comingMessage ? (
        comingMessage?.map((data: any, index: number) => (
          <ChatBoxMessage
            key={index}
            text_message={data?.text_message}
            value={classNameChecker(data.sender_id)}
          />
        ))
      ) : (
        <ChatBoxStartConversation username={username} />
      )}
    </div>
  );
}

export default ChatBoxMessageList;
