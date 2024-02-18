import ChatBoxMessage from './ChatBoxMessage';

function ChatBoxMessageList({ userDataApi, messageRef, comingMessage }: any) {

  const classNameChecker = (user_id: any) => {
    if (!userDataApi) return;
    return user_id === userDataApi.user_id ? "own" : "other";
  };

  return (
    <div
      className="chat__message-list"
      ref={messageRef}
    >
      {comingMessage?.map((data: any, index: number) => {
        let value = classNameChecker(data?.sender_id);
        // let time_sent = new Date(data.time_sent).getHours();
        return (
          <ChatBoxMessage
            key={index}
            value={value}
            data={data}
          />
        );
      })}
    </div>
  );
}

export default ChatBoxMessageList
