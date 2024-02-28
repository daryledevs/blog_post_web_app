import React from 'react'
import ProfileHeaderAvatar from './ProfileHeaderAvatar';
import ProfileHeaderDetails from './ProfileHeaderDetails';
import { IEUserState } from '../redux/reduxIntface';

type ProfileHeaderProps = {
  user: IEUserState;
  followStats: { followers: number; following: number };
};

function ProfileHeader({ user, followStats }: ProfileHeaderProps) {
  return (
    <div className="profile__header">
      <ProfileHeaderAvatar user={user} />
      <ProfileHeaderDetails
        user={user}
        followStats={followStats}
      />
    </div>
  );
}

export default ProfileHeader
