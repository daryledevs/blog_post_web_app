import { useParams }              from 'react-router-dom';
import useFetchUserDataByUsername from '@/hooks/useFetchUserDataByUsername';

import ProfileUserStats        from './ProfileUserStats';
import ProfileUserAvatar       from './ProfileUserAvatar';
import ProfileUserControls     from './ProfileUserControls';
import ProfileUserInfoFooter   from './ProfileUserInfoFooter';

function ProfileUserInfo() {
  const { username } = useParams();
  const { user, isLoading } = useFetchUserDataByUsername({ username });

  if (isLoading) return null;

  return (
    <div className="profile-user-info">
      <div className="profile-user-info-header">
        <ProfileUserAvatar avatarUrl={user?.avatarUrl} />
        <div className="profile-user-info-controls">
          <ProfileUserControls username={user?.username} />
          <ProfileUserStats
            userUuid={user?.uuid}
            username={user?.username}
            className="profile-user-stats-md"
          />
        </div>
      </div>
      <ProfileUserInfoFooter user={user} />
    </div>
  );
}


export default ProfileUserInfo
