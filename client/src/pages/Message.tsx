import React, { useState, useEffect } from "react";
import NewMessage from "../shared/modals/NewMessage";
import SwitchAccount from "../shared/modals/SwitchAccount";
import MessageSideBar from "../components/MessageSideBar";
import MessageChatBox from "../components/MessageChatBox";
import { IEOpenConversation } from "../interfaces/interface";
import { useGetUserDataQuery } from "../redux/api/UserApi";
import SocketService from "../services/SocketServices";

function Message({ socketService }: { socketService: SocketService }) {
  const [openConversation, setOpenConversation] = useState<IEOpenConversation | null>(null);
  const [switchAccountTrggr, setSwitchAccountTrggr] = useState<boolean>(false);
  const [newMessageTrgger, setNewMessageTrgger] = useState<boolean>(false);
  const userApiData = useGetUserDataQuery({ person: ""});

  useEffect(() => {
    if (!userApiData.data) return;
    socketService.addUserId(userApiData.data.user.user_id);
  }, [socketService, userApiData.data]);

  if (userApiData.isLoading || !userApiData.data) return null;

  return (
    <React.Fragment>
      <NewMessage
        newMessageTrgger={newMessageTrgger}
        setNewMessageTrgger={setNewMessageTrgger}
        setOpenConversation={setOpenConversation}
      />
      <SwitchAccount
        switchAccountTrggr={switchAccountTrggr}
        setSwitchAccountTrggr={setSwitchAccountTrggr}
      />
      <div className="message__container">
        <div className="message__parent">
          <MessageSideBar
            user={userApiData.data.user}
            newMessageTrgger={newMessageTrgger}
            switchAccountTrggr={switchAccountTrggr}
            setSwitchAccountTrggr={setSwitchAccountTrggr}
            setNewMessageTrgger={setNewMessageTrgger}
            setOpenConversation={setOpenConversation}
          />
          <MessageChatBox
            openConversation={openConversation}
            socketService={socketService}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
