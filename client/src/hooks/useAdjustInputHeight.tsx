import React, { useEffect } from 'react'

type UseAdjustInputHeightProps = {
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null> | null;
  newMessage: { text_message: string };
};

function useAdjustInputHeight({ inputRef, newMessage }: UseAdjustInputHeightProps) {
  useEffect(() => {
    if (inputRef?.current) {
      if (!newMessage?.text_message) inputRef.current.style.height = "0px";
      if (inputRef.current.scrollHeight > 100) return;
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = scrollHeight + "px";
    }
  }, [inputRef, newMessage]);
}

export default useAdjustInputHeight
