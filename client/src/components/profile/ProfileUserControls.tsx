import ProfileUserControlsActions from './ProfileUserControlsActions';

function ProfileUserControls({ username } : { username: string | undefined }) {
  return (
    <div className="profile-user-controls">
      <p>{username}</p>
      <ProfileUserControlsActions />
    </div>
  );
}

export default ProfileUserControls
