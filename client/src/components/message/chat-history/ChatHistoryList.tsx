import HistoryRecipientCard from './HistoryRecipientCard';

function ChatHistoryList({ list }: { list: any }) {
  return (
    <div className='chat-history-list'>
      {list?.map((chat: any, index: number) => {
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
