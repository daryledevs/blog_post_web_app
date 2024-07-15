import { useParams }           from 'react-router-dom';
import ProfileUserStats        from './ProfileUserStats';
import ProfileUserAvatar       from './ProfileUserAvatar';
import ProfileUserControls     from './ProfileUserControls';
import ProfileUserInfoFooter   from './ProfileUserInfoFooter';
import { useGetUserDataQuery } from '@/redux/api/userApi';

function ProfileUserInfo() {
  const { username } = useParams();
  const { data, isLoading } = useGetUserDataQuery({ person: username || "" });
  const user = data?.user;

  if (isLoading) return null;

  return (
    <div className="profile-user-info">
      <div className="profile-user-info-header">
        <ProfileUserAvatar avatar_url={user?.avatar_url} />
        <div className="profile-user-info-controls">
          <ProfileUserControls username={user?.username} />
          <ProfileUserStats
            user_id={user?.uuid}
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
