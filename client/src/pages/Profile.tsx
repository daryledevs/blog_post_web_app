import React, { useState, useEffect } from 'react'
import avatar from "../assets/icons/avatar.png";
import { useAppSelector } from '../redux/hooks/hooks';
import FollowModal from '../shared/modals/FollowModal';
import GridPost from "../components/GridPost";
import { useParams } from 'react-router-dom';
import api from '../config/api';
import axios from 'axios';

function Profile() {
  const { username } = useParams();
  const posts = useAppSelector((state) => state.post);
  const follows = useAppSelector(state => state.follow);
  const user = useAppSelector(state => state.user);
  
  const [followersTrigger, setFollowersTrigger] = useState(false);
  const [followingTrigger, setFollowingTrigger] = useState(false);
  const [loading, setLoading] = useState<any>(true);

  const [profileData, setProfileData] = useState<any>([]);
  const [postsData, setPostsData] = useState<any>({ post: [] });
  const [followData, setFollowData] = useState<any>({ followers: [], following: [] });
  const [total, setTotal] = useState<any>({ followers: [], following: [] });
  const isUser = () => user.username === username;
  
  useEffect(() => {
    if (username === user.username) {
      setProfileData(user);
      setPostsData(posts);
      setLoading(false);
    } else {
      getUserData(username).then((response) => {
        setProfileData(response.user);
        setPostsData({ post: response.post });
        setFollowData(response.follow);
        setTotal(response.total);
        setLoading(false);
      })
    }
  }, [username]);

  async function getUserData(username: any) {
    const token = sessionStorage.getItem("token");
    return await api.get(`/users/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const user = response.data.user;
        return axios
          .all([
            api.get(`/posts/${user.user_id}`),
            api.post(`/follow/${user.user_id}`, {
              user_id: user.user_id,
              follower_ids: [], 
              following_ids: [],
            }),
            api.get(`/follow/count/${user.user_id}`),
          ])
          .then(
            axios.spread(function (postsResponse, followResponse, totalResponse) {
              const post = postsResponse.data.post;
              const follow = followResponse.data;
              const total = totalResponse.data;
              const data = { user, post, follow, total };
              return Promise.resolve(data)
          })
        );
      }).catch((error) => {
        return Promise.reject(error);
    });
  };
  
  if(loading) return <></>;

  return (
    <>
      {/* MODALS */}
      {followersTrigger && (
        <FollowModal
          setTotal={setTotal}
          user={isUser()}
          list={isUser() ? follows.followers : followData.followers}
          name={"Followers"}
          close={() => setFollowersTrigger(!followersTrigger)}
        />
      )}

      {followingTrigger && (
        <FollowModal
          setTotal={setTotal}
          user={isUser()}
          list={isUser() ? follows.following : followData.following}
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
              alt="user avatar"
            />
          </div>
          <div className="profile__header-details">
            <p>PROFILE</p>
            <h1 className="profile__header-username">{profileData.username}</h1>
            <div className="profile__header-numbers">
              <p>{isUser() ? posts.post.length : postsData.length} Pictures</p>

              <p
                style={{ cursor: "pointer" }}
                onClick={() => setFollowersTrigger(!followersTrigger)}
              >
                {isUser() ? follows.total.followers : total.followers} Followers
              </p>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => setFollowingTrigger(!followingTrigger)}
              >
                {isUser() ? follows.total.following : total.following} Following
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