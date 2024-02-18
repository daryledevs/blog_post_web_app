function ChatBoxInput({ inputRef, newMessage, setNewMessage, sendMessageHandler }: any) {
  
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
      ref={inputRef}
      className="chat__input-box"
      value={newMessage?.text_message}
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
