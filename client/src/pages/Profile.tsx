import React, { useState, useEffect } from 'react'
import avatar from "../assets/icons/avatar.png";
import { useAppSelector } from '../redux/hooks/hooks';
import FollowModal from '../shared/modals/FollowModal';
import GridPost from "../components/GridPost";
import { useNavigate, useParams } from 'react-router-dom';
import api from '../assets/data/api';
import { redirect } from 'react-router-dom';

function Profile() {
  const { username } = useParams();
  const posts = useAppSelector((state) => state.post);
  const follows = useAppSelector(state => state.follow);
  const user = useAppSelector(state => state.user);
  const navigation = useNavigate();
  const [followersTrigger, setFollowersTrigger] = useState(false);
  const [followingTrigger, setFollowingTrigger] = useState(false);
  const [loading, setLoading] = useState<any>(true);

  const [profileData, setProfileData] = useState<any>([]);
  const [postsData, setPostsData] = useState<any>({ post: [] });

  useEffect(() => {
    if(username === user.username){
      setProfileData(user);
      setPostsData(posts);
      setLoading(false);
    } else {
      const token = sessionStorage.getItem("token");
      api
        .get(`/users/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const userData = response.data.user;
          api
            .get(`/posts/${userData.user_id}`)
            .then((response) => {
              const postsData = response.data;
              setProfileData(userData);
              setPostsData(postsData);
              setLoading(false);
            })
            .catch((error) => {
              return navigation("/");
            });
        })
        .catch((error) => {
          return navigation("/404");
        });
    }
  }, []);
  
  if(loading) return <></>;

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
              src={profileData.avatar_url ? profileData.avatar_url : avatar}
              className="profile_avatar"
              alt='user avatar'
            />
          </div>
          <div className="profile__header-details">
            <p>PROFILE</p>
            <h1 className="profile__header-username">{profileData.username}</h1>
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

        {GridPost({ posts: postsData })}
      </div>
    </>
  );
}

export default Profile