import usersPicture from "@/assets/icons/avatar.png";

type UserAvatarProps = {
  avatarUrl: string | null;
  className?: string;
};

function UserAvatar({ avatarUrl, className } : UserAvatarProps) {
  return (
    <img
      alt=""
      className={className}
      src={avatarUrl ? avatarUrl : usersPicture}
    />
  );
};

export default UserAvatar;
