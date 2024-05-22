import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";

type ChatBoxEmojiProps = {
  emojiModalTrigger: boolean;
  newMessage: any;
  setNewMessage: any;
};

function ChatBoxEmojiPicker({
  emojiModalTrigger,
  setNewMessage,
  newMessage,
}: ChatBoxEmojiProps) {
  // Function to choose emoji
  function chooseEmoji(emojiData: EmojiClickData, event: MouseEvent) {
    setNewMessage((prev: any) => ({
      ...prev,
      text_message: (prev?.text_message ?? "") + emojiData.emoji,
    }));
  }

  if (!emojiModalTrigger) return null;
  return (
    <div className="chat-box-emoji-picker">
      <EmojiPicker
        onEmojiClick={chooseEmoji}
        autoFocusSearch={false}
        theme={Theme.AUTO}
        width={"100%"}
      />
    </div>
  );
}

export default ChatBoxEmojiPicker;
