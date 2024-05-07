import { ProfileProps } from "@/interfaces/types";

function ProfileHeader({ user }: ProfileProps) {
  return (
    <div className="profile-header">
      <p>{user.username}</p>
    </div>
  );
}

export default ProfileHeader;
