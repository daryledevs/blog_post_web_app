import { IEConversation }   from '@/interfaces/interface';
import HistoryRecipientCard from './HistoryRecipientCard';

function ChatHistoryList({ list }: { list: IEConversation[] }) {
  return (
    <div className="chat-history-list">
      {list?.map((chat: IEConversation, index: number) => {
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
