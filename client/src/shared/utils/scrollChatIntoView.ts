const scrollChatIntoView = (
  chatListRef: React.RefObject<HTMLDivElement>,
  callback: Function
) => {
  setTimeout(() => {
    chatListRef?.current?.scrollIntoView();
    callback();
  }, 0);
};


export default scrollChatIntoView;