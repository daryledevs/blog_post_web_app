import React, { useState, useEffect } from "react";
import NewMessage from "../shared/modals/NewMessage";
import SwitchAccount from "../shared/modals/SwitchAccount";
import MessageSideBar from "../components/MessageSideBar";
import MessageChatBox from "../components/MessageChatBox";
import { IEOpenConversation } from "../interfaces/interface";
import { useGetUserDataQuery } from "../redux/api/UserApi";

function Message({ socket }: any) {
  const [openConversation, setOpenConversation] = useState<IEOpenConversation | null>(null);
  const [switchAccountTrggr, setSwitchAccountTrggr] = useState<boolean>(false);
  const [newMessageTrgger, setNewMessageTrgger] = useState<boolean>(false);
  const userApiData = useGetUserDataQuery();

  const { addUserId } = socket;
  const useDataApi = useGetUserDataQuery();

  useEffect(() => {
    if (!useDataApi.data) return;
    addUserId(useDataApi.data.user.user_id);
  }, [addUserId, useDataApi.data])

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
            socket={socket}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
