import ProfileUserStats from './ProfileUserStats';
import ProfileUserAvatar from './ProfileUserAvatar';
import { ProfileProps } from '@/interfaces/types';
import ProfileUserControls from './ProfileUserControls';

function ProfileUserInfo({ user }: ProfileProps) {
  return (
    <div className="profile-user-info">
      <div className="profile-user-info-header">
        <ProfileUserAvatar user={user} />
        <div className="profile-user-info-controls">
          <ProfileUserControls user={user} />
          <ProfileUserStats
            user={user}
            className="profile-user-stats-md"
          />
        </div>
      </div>
      <div className="profile-user-info-footer">
        <ProfileUserStats
          user={user}
          className="profile-user-stats-xs"
        />
      </div>
    </div>
  );
}


export default ProfileUserInfo
