import React, { useState, useEffect } from 'react'
import closeModal from "../../assets/icons/close.png";
import { useAppSelector } from '../../redux/hooks/hooks';
import avatar from "../../assets/icons/avatar.png";

interface IESwitchAccount {
  switchAccountTrggr: boolean;
  setSwitchAccountTrggr: (value: boolean) => void;
}

function SwitchAccount({ switchAccountTrggr, setSwitchAccountTrggr }: IESwitchAccount) {
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (switchAccountTrggr && event.code === "Escape") {
        setSwitchAccountTrggr(!switchAccountTrggr);
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [switchAccountTrggr, setSwitchAccountTrggr]);

  if(!switchAccountTrggr) return null;

  return (
    <div className="switch-account__container">
      <div className="switch-account__parent">
        <div className="switch-account__header">
          <p>Switch Account</p>
          <img
            src={closeModal}
            onClick={() => setSwitchAccountTrggr(!switchAccountTrggr)}
            alt=""
          />
        </div>
        <div className='switch-account__existing-account'>
          <img src={user.avatar_url ? user.avatar_url : avatar} alt='' />
          {user.username}
        </div>
        <div className='switch-account__footer'>
          <p>Login into an Existing Account</p>
        </div>
      </div>
    </div>
  );
}

export default SwitchAccount
