import ChatHistoryRecipient from "./ChatHistoryRecipient";

type ChatHistoryProps = {
  chatMembers: any[];
};

function ChatHistory({ chatMembers }: ChatHistoryProps) {
  return (
    <div className="chat-history__container">
      {chatMembers.map((chat: any, index: number) => {
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
