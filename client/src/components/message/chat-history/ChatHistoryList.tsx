import { IConversation }   from '@/interfaces/interface';
import HistoryRecipientCard from './HistoryRecipientCard';

function ChatHistoryList({ list }: { list: IConversation[] }) {
  return (
    <div className="chat-history-list">
      {list?.map((chat: IConversation, index: number) => {
        return (
          <HistoryRecipientCard
            key={index}
            chat={chat}
          />
        );
      })}
    </div>
  );
};

export default ChatHistoryList
