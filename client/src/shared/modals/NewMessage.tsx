import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectMessage, setNewMessageTrigger, setOpenConversation } from "../../redux/slices/messageSlice";

import Button from "shared/components/Elements/Button";
import Recipients from "../components/Recipients";
import NewMessageLists from "shared/components/NewMessageLists";
import NewMessageHeader from "shared/components/NewMessageHeader";

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
