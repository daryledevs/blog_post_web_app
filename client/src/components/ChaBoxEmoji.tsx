import emojiIcon from "../assets/icons/emoji-icon.png";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";

function ChatBoxEmoji({ newMessage, setNewMessage, emojiModalTrigger, setEmojiModalTrigger }: any) {

  function chooseEmoji(emojiData: EmojiClickData, event: MouseEvent) {
    setNewMessage({
      ...newMessage,
      text_message: newMessage?.text_message + emojiData.emoji,
    });
  }

  return (
    <div className="chat__emoji-container">
      <img
        src={emojiIcon}
        onClick={() => setEmojiModalTrigger(!emojiModalTrigger)}
        className="chat__emoji-modal"
        alt=""
      />
      {emojiModalTrigger && (
        <div className="chat__emoji-parent">
          <EmojiPicker
            onEmojiClick={chooseEmoji}
            autoFocusSearch={false}
            theme={Theme.AUTO}
          />
        </div>
      )}
    </div>
  );
}

export default ChatBoxEmoji;
