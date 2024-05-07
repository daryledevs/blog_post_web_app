import { ProfileProps } from '@/interfaces/types'
import ProfileUserControlsActions from './ProfileUserControlsActions';

function ProfileUserControls({ user }: ProfileProps) {
  return (
    <div className="profile-user-controls">
      <p>{user?.username}</p>
      <ProfileUserControlsActions />
    </div>
  );
}

export default ProfileUserControls
