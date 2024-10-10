import { IUser }  from "@/interfaces/interface";
import ProfileUserStats from "./ProfileUserStats";

function ProfileUserInfoFooter({ user }: { user: IUser | undefined }) {
  return (
    <div className="profile-user-info-footer">
      <ProfileUserStats
        userUuid={user?.uuid}
        username={user?.username}
        className="profile-user-stats-xs"
      />
    </div>
  );
}

export default ProfileUserInfoFooter
