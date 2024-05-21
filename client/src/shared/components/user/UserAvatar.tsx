import usersPicture from "@/assets/icons/avatar.png";

type UserAvatarProps = {
  avatar_url: string | null;
  className?: string;
};

function UserAvatar({ avatar_url, className } : UserAvatarProps) {
  return (
    <img
      alt=""
      className={className}
      src={avatar_url ? avatar_url : usersPicture}
    />
  );
};

export default UserAvatar;
