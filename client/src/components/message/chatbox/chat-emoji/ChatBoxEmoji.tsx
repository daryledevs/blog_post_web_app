import emojiIcon          from "@/assets/icons/emoji-icon.png";
import ChatBoxEmojiIcon    from "./ChatBoxEmojiIcon";
import ChatBoxEmojiPicker from "./ChatBoxEmojiPicker";

type ChatBoxEmojiProps = {
  newMessage: any;
  setNewMessage: React.Dispatch<React.SetStateAction<any>>;
  emojiModalTrigger: boolean;
  setEmojiModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
};

function ChatBoxEmoji({
  newMessage,
  setNewMessage,
  emojiModalTrigger,
  setEmojiModalTrigger,
}: ChatBoxEmojiProps) {
  return (
    <div className="chat-box-emoji">
      <ChatBoxEmojiIcon
        emojiIcon={emojiIcon}
        setEmojiModalTrigger={setEmojiModalTrigger}
        emojiModalTrigger={emojiModalTrigger}
      />
      <ChatBoxEmojiPicker
        emojiModalTrigger={emojiModalTrigger}
        setNewMessage={setNewMessage}
        newMessage={newMessage}
      />
    </div>
  );
}

export default ChatBoxEmoji;
