import {
  selectMessage,
  setOpenConversation,
} from "@/redux/slices/messageSlice";
import { IConversation } from "@/interfaces/interface";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";

import UserAvatar from "@/shared/components/user/UserAvatar";
import UserFullName from "@/shared/components/user/UsersFullName";
import UserUsername from "@/shared/components/user/UserUsername";

function HistoryRecipientCard({ chat }: { chat: IConversation }) {
  const chatState = useAppSelector(selectMessage);
  const { openConversation } = chatState;
  const dispatch = useAppDispatch();

  const className =
    openConversation[0]?.uuid === chat.uuid
      ? "history-recipient-card-active"
      : "";

  return (
    <div
      key={chat.uuid}
      className={`history-recipient-card ${className}`}
      onClick={() => dispatch(setOpenConversation(chat))}
    >
      <UserAvatar
        avatarUrl={chat?.avatarUrl}
        className="history-recipient-card-avatar"
      />
      {chat?.firstName || chat?.lastName ? (
        <UserFullName
          firstName={chat?.firstName}
          lastName={chat?.lastName}
          className="history-recipient-name"
        />
      ) : (
        <UserUsername username={chat?.username} />
      )}
    </div>
  );
}

export default HistoryRecipientCard;
