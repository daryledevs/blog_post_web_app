import React from 'react'
import usersPicture from "../assets/icons/avatar.png";

function ChatBoxMessage({ value, data }: any) {
  return (
    <div className={`chat__${value}-container`}>
      <div className={`chat__${value}-message`}>
        <img
          src={usersPicture}
          className={`chat__${value}-picture`}
          alt=""
        />
        <p className={`chat__${value}-text`}>{data?.text_message}</p>
      </div>
    </div>
  );
}

export default ChatBoxMessage
