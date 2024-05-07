import avatar           from "@/assets/images/avatar.png"
import { ProfileProps } from "@/interfaces/types";

function ProfileUserAvatar({ user }: ProfileProps) {
  return (
    <div className="profile-user-avatar">
      <img
        src={user.avatar_url ? user.avatar_url : avatar}
        alt="user avatar"
      />
    </div>
  );
}

export default ProfileUserAvatar
