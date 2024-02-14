import ChatHistoryRecipient from "./ChatHistoryRecipient";

type ChatHistoryProps = {
  user: any;
  chatMembers: any[];
  setOpenConversation: (id: string) => void;
};

function ChatHistory({
  user,
  chatMembers,
  setOpenConversation,
}: ChatHistoryProps) {
  return (
    <div className="chat-history__container">
      {chatMembers.map((chat: any, index: number) => {
        return (
          <ChatHistoryRecipient
            key={index}
            user={user}
            chat={chat}
            setOpenConversation={setOpenConversation}
          />
        );
      })}
    </div>
  );
}

export default ChatHistory;
