import avatar from "@/assets/icons/avatar.png";

function FollowUserAvatar({ avatarUrl }: { avatarUrl: string }) {
  return (
    <img
      alt=""
      src={avatarUrl ? avatarUrl : avatar}
      className="item-card__avatar"
    />
  );
}

export default FollowUserAvatar;
