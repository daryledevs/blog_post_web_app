import { useState } from 'react'
import ChatBoxEmoji from './ChaBoxEmoji';
import ChatBoxInput from './ChatBoxInput';

function ChatBoxSubmission({
  inputRef,
  newMessage,
  setNewMessage,
  sendMessageHandler,
}: any) {
  const [emojiModalTrigger, setEmojiModalTrigger] = useState<boolean>(false);

  return (
    <div className="chat__input-container">
      <ChatBoxEmoji
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        emojiModalTrigger={emojiModalTrigger}
        setEmojiModalTrigger={setEmojiModalTrigger}
      />
      <ChatBoxInput
        inputRef={inputRef}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessageHandler={sendMessageHandler}
      />
      <button
        className="chat__input-box-btn"
        onClick={sendMessageHandler}
      >
        Send
      </button>
    </div>
  );
}

export default ChatBoxSubmission
