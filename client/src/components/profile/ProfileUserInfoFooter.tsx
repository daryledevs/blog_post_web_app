import { IEUserState }  from "@/interfaces/interface";
import ProfileUserStats from "./ProfileUserStats";

function ProfileUserInfoFooter({ user }: { user: IEUserState | undefined }) {
  return (
    <div className="profile-user-info-footer">
      <ProfileUserStats
        user_id={user?.uuid}
        username={user?.username}
        className="profile-user-stats-xs"
      />
    </div>
  );
}

export default ProfileUserInfoFooter
