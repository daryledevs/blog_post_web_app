import ChatHeader from './ChatHeader';
import ChatHistory from './ChatHistory';

type MessageSideBarProps = {
  user: any,
  chatMembers: any[]
  newMessageTrgger: boolean,
  switchAccountTrggr: boolean,
  setSwitchAccountTrggr: (value: boolean) => void,
  setNewMessageTrgger: (value: boolean) => void,
  setOpenConversation: (id: string) => void,
}

function MessageSideBar({
  user,
  chatMembers,
  newMessageTrgger,
  switchAccountTrggr,
  setSwitchAccountTrggr,
  setNewMessageTrgger,
  setOpenConversation,
}: MessageSideBarProps) {
  
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
        user={user}
        chatMembers={chatMembers}
        setOpenConversation={setOpenConversation}
      />
    </div>
  );
}

export default MessageSideBar
