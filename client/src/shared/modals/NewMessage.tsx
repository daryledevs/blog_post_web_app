import {
  resetRecipients,
  selectMessage,
  setNewMessageTrigger,
  setOpenConversation,
}                                         from "../../redux/slices/messageSlice";
import BaseModal                          from "./BaseModal";
import WrapperModal                       from "./WrapperModal";
import Button                             from "../components/element/Button";
import Recipients                         from "../components/new-message-modal/recipient/Recipients";
import NewMessageLists                    from "../components/new-message-modal/NewMessageLists";
import NewMessageHeader                   from "../components/new-message-modal/NewMessageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

function NewMessage() {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessage);
  const recipients = messages.recipients;
  const openConversation = messages.openConversation;
  const recipientLimit = !recipients.length || recipients.length >= 2;

  function newChatHandler() {
    const isUserInConversation = recipients.some((recipient) =>
      openConversation.some(
        (conversationParticipant) =>
          recipient.user_id === conversationParticipant.user_id
      )
    );
    dispatch(resetRecipients({}));
    dispatch(setNewMessageTrigger({}));
    if (isUserInConversation) return;
    dispatch(setOpenConversation(recipients));
  };

  if (!messages.newMessageTrigger) return null;

  return (
    <BaseModal>
      <WrapperModal className="new-message-wrapper">
        <div className="new-message-container">
          <NewMessageHeader />
          <div className="new-message__search-bar">
            <Recipients />
          </div>
          <NewMessageLists />
          <Button
            onClick={newChatHandler}
            disabled={recipientLimit}
          >
            Chat
          </Button>
        </div>
      </WrapperModal>
    </BaseModal>
  );
}

export default NewMessage;
