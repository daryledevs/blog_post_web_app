import ChatBoxMessage           from "./ChatBoxMessageCard";
import { selectMessage }        from "@/redux/slices/messageSlice";
import { useAppSelector }       from "@/hooks/reduxHooks";
import ChatBoxStartConversation from "./ChatBoxStartConversation";
import { useGetUserDataQuery } from "@/redux/api/userApi";

function ChatBoxMessageList({ messageRef, comingMessage }: any) {
  const messages = useAppSelector(selectMessage);
  const username = messages.openConversation?.[0]?.username;
  const userDataApi = useGetUserDataQuery({ person: "" });

  const classNameChecker = (user_id: any) => {
    return user_id === userDataApi?.data?.user.user_id ? "own" : "other";
  };

  if(!userDataApi.data) return null;
  
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
