import { useState } from 'react'
import Button       from '@/components/form-controllers/button/SubmitBtn';
import ChatBoxEmoji from './chat-emoji/ChatBoxEmoji';
import ChatBoxInput from './ChatBoxInput';

type ChatBoxSubmissionProps = {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  newMessage: any;
  setNewMessage: React.Dispatch<React.SetStateAction<any>>;
  sendMessageHandler: () => void;
};

function ChatBoxSubmission({
  inputRef,
  newMessage,
  setNewMessage,
  sendMessageHandler,
}: ChatBoxSubmissionProps) {
  const [emojiModalTrigger, setEmojiModalTrigger] = useState<boolean>(false);

  return (
    <div className="chat-box-submission">
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
      <Button
        text="Send"
        onClick={sendMessageHandler}
        className="chat-box-send-button"
      />
    </div>
  );
}

export default ChatBoxSubmission
