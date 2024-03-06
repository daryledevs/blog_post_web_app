import avatar from "../../assets/icons/avatar.png";

function FollowUserAvatar({ avatar_url }:{ avatar_url: string }) {
  return (
    <img
      alt=""
      src={avatar_url ? avatar_url : avatar}
      className="item-card__avatar"
    />
  );
}

export default FollowUserAvatar;
