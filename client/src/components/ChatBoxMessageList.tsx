import { selectMessage } from 'redux/slices/messageSlice';
import ChatBoxMessage from './ChatBoxMessage';
import { useAppSelector } from 'hooks/reduxHooks';

function ChatBoxMessageList({ userDataApi, messageRef, comingMessage }: any) {
  const messages = useAppSelector(selectMessage);
  const username = messages.openConversation?.[0]?.username;

  const classNameChecker = (user_id: any) => user_id === userDataApi.user_id ? "own" : "other";

  return (
    <div
      className="chat__message-list"
      ref={messageRef}
    >
      {typeof comingMessage !== "string" ? (
        comingMessage?.map((data: any, index: number) => (
          <ChatBoxMessage
            key={index}
            value={classNameChecker(data.sender_id)}
            data={data}
          />
        ))
      ) : (
        <p>Start a conversation with {username}</p>
      )}
    </div>
  );
}

export default ChatBoxMessageList
