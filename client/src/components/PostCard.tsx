import React from 'react'
import avatar from "../assets/icons/avatar.png";
import settingIcon from "../assets/icons/setting-icon.png";
import heartIcon_uncheck from "../assets/icons/heart_uncheck.png";
import heartIcon_check from "../assets/icons/heart_check.png";
import commentIcon from "../assets/icons/comment.png";
import bookmark from "../assets/icons/bookmark.png";
import emojiIcon from "../assets/icons/emoji-icon.png";
import shareIcon from "../assets/icons/share.png";
// mock post
import user_post from "../assets/images/mock_post.jpg";

function PostCard() {
  return (
    <div className="post-card-container">
      <div className='post-card__header'>
        <img src={avatar} className="post-card__header-avatar" alt='user-profile-picture'/>
        <p>Daryle De Vera</p>
        <img src={settingIcon} className='post-card__header-settings'/>
      </div>
      <div className='post-card__body'>
        <img src={user_post} className="post-card__body-post" />
        <div className='post-card__body-icons-container'>
          <img src={heartIcon_uncheck} alt='like post' />
          <img src={commentIcon} alt='comment section' />
          <img src={shareIcon} alt='share' />
          <img src={bookmark} alt='save post' />
        </div>
      </div>
      <div className='post-card__details'>
        <div className='post-card__details-caption'>
          <h4>Daryle De Vera</h4>
          <p>Sunsets never disappoint us - they're always beautiful.</p>
        </div>
        <div className='post-card__details-meta'>
          <p>View all 20 comments</p>
          <p>1 DAY AGO</p>
        </div>
      </div>
      <div className='post-card__comment'>
        <img src={emojiIcon} />
        <input
          placeholder='Add a comment...'
        />
        <p>Post</p>
      </div>
    </div>
  );
}

export default PostCard;