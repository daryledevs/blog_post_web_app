import { IEConversation }  from "@/interfaces/interface";
import ChatHistoryList     from "./ChatHistoryList";

type ChatHistoryProps = {
  list: IEConversation[];
  isLoading: boolean;
};

function ChatHistory({ list, isLoading }: ChatHistoryProps) {
  if (isLoading) return null;
  
  return (
    <div className="chat-history">
      <p>Messages</p>
      <ChatHistoryList list={list} />
    </div>
  );
}

export default ChatHistory;
