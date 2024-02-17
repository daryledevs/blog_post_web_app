import ChatHistoryRecipient from "./ChatHistoryRecipient";
import { IEOpenConversation } from "../interfaces/interface";

type ChatHistoryProps = {
  chatMembers: any[];
  setOpenConversation: (value: IEOpenConversation | null) => void;
};

function ChatHistory({
  chatMembers,
  setOpenConversation,
}: ChatHistoryProps) {
  return (
    <div className="chat-history__container">
      {chatMembers.map((chat: any, index: number) => {
        return (
          <ChatHistoryRecipient
            key={index}
            chat={chat}
            setOpenConversation={setOpenConversation}
          />
        );
      })}
    </div>
  );
}

export default ChatHistory;
