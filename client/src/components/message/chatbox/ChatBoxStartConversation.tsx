function ChatBoxStartConversation({ username }: { username: string }) {
  return (
    <p className="chat-box-start-conversation">
      Start a conversation with {username}
    </p>
  );
}

export default ChatBoxStartConversation;
