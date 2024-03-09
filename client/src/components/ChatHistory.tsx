import ChatHistoryRecipient from "./ChatHistoryRecipient";

type ChatHistoryProps = {
  list: any;
  isLoading: boolean;
};

function ChatHistory({ list, isLoading }: ChatHistoryProps) {
  return (
    <div className="chat-history__container">
      {!isLoading &&
        list?.map((chat: any, index: number) => {
          return (
            <ChatHistoryRecipient
              key={index}
              chat={chat}
            />
          );
        })}
    </div>
  );
}

export default ChatHistory;
