import React, { useState } from "react";
import { useAppSelector } from "../redux/hooks/hooks";
import NewMessage from "../shared/modals/NewMessage";
import SwitchAccount from "../shared/modals/SwitchAccount";
import MessageSideBar from "../components/MessageSideBar";
import MessageChatBox from "../components/MessageChatBox";

function Message() {
  const [openConversation, setOpenConversation] = useState<string>("");
  const [switchAccountTrggr, setSwitchAccountTrggr] = useState<boolean>(false);
  const [newMessageTrgger, setNewMessageTrgger] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const chatMembers = useAppSelector((state) => state.chatMember);
  
  return (
    <React.Fragment>
      <NewMessage
        newMessageTrgger={newMessageTrgger}
        setNewMessageTrgger={setNewMessageTrgger}
      />
      <SwitchAccount
        switchAccountTrggr={switchAccountTrggr}
        setSwitchAccountTrggr={setSwitchAccountTrggr}
      />
      <div className="message__container">
        <div className="message__parent">
          <MessageSideBar
            user={user}
            chatMembers={chatMembers}
            newMessageTrgger={newMessageTrgger}
            switchAccountTrggr={switchAccountTrggr}
            setSwitchAccountTrggr={setSwitchAccountTrggr}
            setNewMessageTrgger={setNewMessageTrgger}
            setOpenConversation={setOpenConversation}
          />
          <MessageChatBox openConversation={openConversation} setOpenConversation={setOpenConversation} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
