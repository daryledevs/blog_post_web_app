import { IEUserState }  from "@/interfaces/interface";
import ProfileUserStats from "./ProfileUserStats";

function ProfileUserInfoFooter({ user }: { user: IEUserState }) {
  return (
    <div className="profile-user-info-footer">
      <ProfileUserStats
        user={user}
        className="profile-user-stats-xs"
      />
    </div>
  );
}

export default ProfileUserInfoFooter
