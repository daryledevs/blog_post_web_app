import {
  selectMessage,
  setOpenConversation,
}                                         from "@/redux/slices/messageSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import UserAvatar                         from "@/shared/components/user/UserAvatar";
import UserFullName                       from "@/shared/components/user/UsersFullName";

function HistoryRecipientCard({ chat }: { chat: any }) {
  const chatState = useAppSelector(selectMessage);
  const { openConversation } = chatState;
  const dispatch = useAppDispatch();

  const className =
    openConversation[0]?.conversation_id === chat.conversation_id
      ? "history-recipient-card-active"
      : "";

  return (
    <div
      key={chat.conversation_id}
      className={`history-recipient-card ${className}`}
      onClick={() => dispatch(setOpenConversation(chat))}
    >
      <UserAvatar
        avatar_url={chat.avatar_url}
        className="history-recipient-card-avatar"
      />
      <UserFullName
        first_name={chat.first_name}
        last_name={chat.last_name}
        className="history-recipient-name"
      />
    </div>
  );
}

export default HistoryRecipientCard;
