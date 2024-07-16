import React, { useEffect }    from "react";

import NewMessage              from "@/shared/modals/NewMessage";
import SwitchAccount           from "@/shared/modals/SwitchAccount";
import MessageSidebar          from "@/components/message/MessageSidebar";
import MessageChatBox          from "@/components/message/MessageChatBox";

import SocketService           from "@/services/SocketServices";
import { useGetUserDataQuery } from "@/redux/api/userApi";
import { useAppDispatch }      from "@/hooks/reduxHooks";
import { setOpenConversation } from "@/redux/slices/messageSlice";

function Message({ socketService }: { socketService: SocketService | null }) {
  const dispatch = useAppDispatch();
  const userApiData = useGetUserDataQuery({ person: "" });

  // Reset open conversation when component unmount
  useEffect(() => {
    dispatch(setOpenConversation([]));
  }, []);

  if (userApiData.isLoading || !userApiData.data) return null;

  return (
    <React.Fragment>
      <NewMessage />
      <SwitchAccount />
      <div className="message">
        <div className="message__container">
          <MessageSidebar user={userApiData.data?.user} />
          <MessageChatBox socketService={socketService} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Message;
