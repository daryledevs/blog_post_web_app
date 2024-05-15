type ChatBoxEmojiIconProps = {
  emojiIcon: string;
  setEmojiModalTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  emojiModalTrigger: boolean;
};

function ChatBoxEmojiIcon({
  emojiIcon,
  setEmojiModalTrigger,
  emojiModalTrigger,
}: ChatBoxEmojiIconProps) {
  return (
    <img
      alt=""
      src={emojiIcon}
      className="chat-box-emoji-modal"
      onClick={() => setEmojiModalTrigger(!emojiModalTrigger)}
    />
  );
}

export default ChatBoxEmojiIcon
