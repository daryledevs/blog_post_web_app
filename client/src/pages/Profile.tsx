import React, { useState } from 'react'
import avatar from "../assets/icons/avatar.png";
import { useAppSelector } from '../redux/hooks/hooks';
import FollowModal from '../shared/modals/FollowModal';
import GridPost from "../components/GridPost";

function Profile() {
  const posts = useAppSelector((state) => state.post);
  const follows = useAppSelector(state => state.follow);
  const user = useAppSelector(state => state.user);
  const [followersTrigger, setFollowersTrigger] = useState(false);
  const [followingTrigger, setFollowingTrigger] = useState(false);

  return (
    <>
      {/* MODALS */}
      {followersTrigger && (
        <FollowModal
          list={follows.followers}
          name={"Followers"}
          close={() => setFollowersTrigger(!followersTrigger)}
        />
      )}

      {followingTrigger && (
        <FollowModal
          list={follows.following}
          name={"Following"}
          close={() => setFollowingTrigger(!followingTrigger)}
        />
      )}

      <div className="profile__container">
        <div className="profile__header">
          <div className="profile__avatar-container">
            <img
              src={user.avatar_url ? user.avatar_url : avatar}
              className="profile_avatar"
            />
          </div>
          <div className="profile__header-details">
            <p>PROFILE</p>
            <h1 className="profile__header-username">{user.username}</h1>
            <div className="profile__header-numbers">
              <p>{posts.post.length} Pictures</p>

              <p
                style={{ cursor: "pointer" }}
                onClick={() => setFollowersTrigger(!followersTrigger)}
              >
                {follows.total.followers} Followers
              </p>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => setFollowingTrigger(!followingTrigger)}
              >
                {follows.total.following} Following
              </p>

            </div>
          </div>
        </div>

        {GridPost()}
      </div>
    </>
  );
}

export default Profile