import React, { useEffect } from 'react'

type UseAdjustInputHeightProps = {
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null> | null;
  newMessage: { text_message: string };
  clearMessage: boolean;
};

function useAdjustInputHeight({ inputRef, newMessage, clearMessage }: UseAdjustInputHeightProps) {
  useEffect(() => {
    if (inputRef?.current) {
      if (!newMessage?.text_message) inputRef.current.style.height = "0px";
      if (inputRef.current.scrollHeight > 100) return;
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight + "px";
    }
  }, [inputRef, newMessage, clearMessage]);
}

export default useAdjustInputHeight
