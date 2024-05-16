import React, { useEffect }    from "react";

import NewMessage              from "@/shared/modals/NewMessage";
import SwitchAccount           from "@/shared/modals/SwitchAccount";
import MessageSidebar          from "@/components/message/MessageSidebar";
import MessageChatBox          from "@/components/message/MessageChatBox";

import SocketService           from "@/services/SocketServices";
import { useGetUserDataQuery } from "@/redux/api/userApi";

function Message({ socketService }: { socketService: SocketService | null }) {
  const userApiData = useGetUserDataQuery({ person: "" });

  useEffect(() => {
    if (!socketService) return;
    socketService.onConnection();
    return () => socketService.onDisconnect();
  }, [socketService]);

  if (userApiData.isLoading || !userApiData.data) return null;

  return (
    <React.Fragment>
      <NewMessage />
      <SwitchAccount />
      <div className="message">
        <div className="message__container">
          <MessageSidebar user={userApiData.data.user} />
          <MessageChatBox socketService={socketService} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
