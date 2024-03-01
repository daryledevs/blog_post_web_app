import React from "react";
import NewMessage from "../shared/modals/NewMessage";
import SwitchAccount from "../shared/modals/SwitchAccount";
import MessageSideBar from "../components/MessageSideBar";
import MessageChatBox from "../components/MessageChatBox";
import { useGetUserDataQuery } from "../redux/api/UserApi";
import SocketService from "../services/SocketServices";

function Message({ socketService }: { socketService: SocketService }) {
  const userApiData = useGetUserDataQuery({ person: "" });
  if (userApiData.isLoading || !userApiData.data) return null;

  return (
    <React.Fragment>
      <NewMessage />
      <SwitchAccount />
      <div className="message__container">
        <div className="message__parent">
          <MessageSideBar
            user={userApiData.data.user}
          />
          <MessageChatBox 
            socketService={socketService}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
