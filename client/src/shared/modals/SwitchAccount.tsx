import {  useEffect }                             from 'react'

import closeModal                                 from "@/assets/icons/close.png";
import avatar                                     from "@/assets/icons/avatar.png";

import { useGetUserDataQuery }                    from '@/redux/api/userApi';
import { useAppDispatch, useAppSelector }         from '@/hooks/reduxHooks';
import { selectMessage, setSwitchAccountTrigger } from '@/redux/slices/messageSlice';

function SwitchAccount() {
  const userDataApi = useGetUserDataQuery({ person: "" });
  const user = userDataApi.data?.user;
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectMessage);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (messages.switchAccountTrigger && event.code === "Escape") {
        dispatch(setSwitchAccountTrigger({}));
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [messages.switchAccountTrigger]);

  if (!messages.switchAccountTrigger || userDataApi.isLoading) return null;

  return (
    <div className="switch-account__container">
      <div className="switch-account__parent">
        <div className="switch-account__header">
          <p>Switch Account</p>
          <img
            src={closeModal}
            onClick={() => dispatch(setSwitchAccountTrigger({}))}
            alt=""
          />
        </div>
        <div className="switch-account__existing-account">
          <img
            src={user?.avatar_url ? user.avatar_url : avatar}
            alt=""
          />
          {user?.username}
        </div>
        <div className="switch-account__footer">
          <p>Login into an Existing Account</p>
        </div>
      </div>
    </div>
  );
}

export default SwitchAccount;
