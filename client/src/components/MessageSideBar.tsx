import ChatHeader from './ChatHeader';
import ChatHistory from './ChatHistory';
import { useGetAllChatsQuery } from "../redux/api/ChatApi";
import { IEOpenConversation } from "../interfaces/interface";

type MessageSideBarProps = {
  user: any;
  newMessageTrgger: boolean;
  switchAccountTrggr: boolean;
  setSwitchAccountTrggr: (value: boolean) => void;
  setNewMessageTrgger: (value: boolean) => void;
  setOpenConversation: (value: IEOpenConversation | null) => void;
};

function MessageSideBar({
  user,
  newMessageTrgger,
  switchAccountTrggr,
  setSwitchAccountTrggr,
  setNewMessageTrgger,
  setOpenConversation,
}: MessageSideBarProps) {

  const chatMembers = useGetAllChatsQuery({
    user_id: user.user_id,
    conversation_id: "",
  });

  if(chatMembers.isLoading) return null;
  
  return (
    <div className="message__sidebar">
      <ChatHeader
        user={user}
        newMessageTrgger={newMessageTrgger}
        switchAccountTrggr={switchAccountTrggr}
        setSwitchAccountTrggr={setSwitchAccountTrggr}
        setNewMessageTrgger={setNewMessageTrgger}
      />
      <ChatHistory
        chatMembers={chatMembers?.data.data}
        setOpenConversation={setOpenConversation}
      />
    </div>
  );
}

export default MessageSideBar
