import React, { useState } from 'react'
import avatar from "../assets/icons/avatar.png";
import { useAppSelector } from '../redux/hooks/hooks';

function Profile() {

  const follows = useAppSelector(state => state.follow);
  const posts = useAppSelector(state => state.post);
  const user = useAppSelector(state => state.user);
  
  // for every container or row of pictures, being divided into 3 items to prevent from being distorted
  const GridPost = function () {
    let organizedPost: any[][] = [];

    for (let i = 0; i < posts.post.length; i++) {
      if (i % 2 == 0) {
        const value = posts.post.slice(i === 0 ? i : i + 1, i + 3);
        organizedPost.push([value]);
      }
    }

    return (
      <React.Fragment >
        {organizedPost.map((element:any, index:number) => {
            return(
              <div className="profile__post-container" key={index}>
                {element.map((post:any, idx:number) => {
                  return (
                    <React.Fragment key={`key_${idx}`}>
                      {post.map((item:any) => {
                        return (
                          <div key={item.post_id}>
                            <img
                              src={item.image_url}
                              className="profile__image-post"
                            />
                          </div>
                        );
                      })}
                    </React.Fragment>
                  )
              })}
              </div>
            )
        })}
      </React.Fragment>
    );
  };
  
  return (
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
            <p>{follows.total.followers} Followers</p>
            <p>{follows.total.following} Following</p>
          </div>
        </div>
      </div>
      {GridPost()}
    </div>
  );
}

export default Profile