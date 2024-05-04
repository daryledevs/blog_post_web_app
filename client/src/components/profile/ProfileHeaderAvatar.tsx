import avatar          from "@/assets/icons/avatar.png"
import { IEUserState } from "@/interfaces/interface";

type ProfileHeaderProps = {
  user: IEUserState;
};

function ProfileHeaderAvatar({ user }: ProfileHeaderProps) {
  return (
    <div className="profile__avatar-container">
      <img
        src={user.avatar_url ? user.avatar_url : avatar}
        className="profile_avatar"
        alt="user avatar"
      />
    </div>
  );
}

export default ProfileHeaderAvatar
