import avatar from "@/assets/images/avatar.png"

function ProfileUserAvatar({
  avatarUrl,
}: {
  avatarUrl: string | null | undefined;
}) {
  return (
    <div className="profile-user-avatar">
      <img
        alt="user avatar"
        src={avatarUrl ? avatarUrl : avatar}
      />
    </div>
  );
}

export default ProfileUserAvatar
