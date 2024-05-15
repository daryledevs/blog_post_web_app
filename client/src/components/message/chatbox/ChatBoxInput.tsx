type ChatBoxInputProps = {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  newMessage: any;
  setNewMessage: React.Dispatch<React.SetStateAction<any>>;
  sendMessageHandler: () => void;
};

function ChatBoxInput({
  inputRef,
  newMessage,
  setNewMessage,
  sendMessageHandler,
}: ChatBoxInputProps) {
  const eventFilter = (event: any) => {
    return (
      (event.key !== "Enter" && event.shiftKey === false) ||
      (event.key === "Enter" && event.shiftKey === true) ||
      event.shiftKey
    );
  };

  return (
    <textarea
      rows={1}
      className="chat-box-input"
      value={newMessage?.text_message}
      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
      onChange={(event: any) =>
        setNewMessage({ ...newMessage, text_message: event.target.value })
      }
      onKeyDown={(event) => {
        if (eventFilter(event)) return;
        sendMessageHandler();
      }}
    ></textarea>
  );
}

export default ChatBoxInput;
