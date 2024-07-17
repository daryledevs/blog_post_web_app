import downArrow                   from "@/assets/icons/down-arrow.png";
import { useAppDispatch }          from "@/hooks/reduxHooks";
import { setSwitchAccountTrigger } from "@/redux/slices/messageSlice";

function HeaderSwitchAccount({ username }: { username: string }) {
  const dispatch = useAppDispatch();

  return (
    <div
      className="header-switch-account"
      onClick={() => dispatch(setSwitchAccountTrigger({}))}
    >
      <p>{username}</p>
      <img
        alt=""
        src={downArrow}
        className="header-switch-account-icon"
      />
    </div>
  );
}

export default HeaderSwitchAccount;
