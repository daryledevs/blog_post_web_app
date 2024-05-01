import {
  selectMessage,
  setNewMessageTrigger,
  setOpenConversation,
}                                         from "../../redux/slices/messageSlice";
import { useState }                       from "react";
import Button                             from "../components/element/Button";
import Recipients                         from "../components/new-message-modal/recipients/Recipients";
import NewMessageLists                    from "../components/new-message-modal/NewMessageLists";
import NewMessageHeader                   from "../components/new-message-modal/NewMessageHeader";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

function NewMessage() {
  const messages = useAppSelector(selectMessage);
  const dispatch = useAppDispatch();

  const [recipients, setRecipients] = useState<any>([]);
  const [search, setSearch] = useState<string>("");

  function newChatHandler() {
    dispatch(setOpenConversation(recipients));
    dispatch(setNewMessageTrigger());
    setRecipients([]);
  }

  if (!messages.newMessageTrigger) return null;

  return (
    <div className="new-message__container">
      <div className="new-message__parent">
        <NewMessageHeader />
        <div className="new-message__search-bar">
          <Recipients
            search={search}
            setSearch={setSearch}
            recipients={recipients}
            setRecipients={setRecipients}
          />
        </div>
        <NewMessageLists
          search={search}
          setSearch={setSearch}
          recipients={recipients}
          setRecipients={setRecipients}
        />
        <Button
          onClick={newChatHandler}
          disabled={
            !recipients.length || 
            recipients.length >= 2 ? true : false
          }
        >
          Chat
        </Button>
      </div>
    </div>
  );
}

export default NewMessage;
