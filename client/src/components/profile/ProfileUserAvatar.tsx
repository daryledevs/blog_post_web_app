import avatar from "@/assets/images/avatar.png"

function ProfileUserAvatar({ avatar_url }: { avatar_url: string | undefined }) {
  return (
    <div className="profile-user-avatar">
      <img
        alt="user avatar"
        src={avatar_url ? avatar_url : avatar}
      />
    </div>
  );
}

export default ProfileUserAvatar
