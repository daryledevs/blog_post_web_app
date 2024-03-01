import avatar from "../assets/icons/avatar.png";
import settingIcon from "../assets/icons/setting-icon.png";
import heartIcon_uncheck from "../assets/icons/heart_uncheck.png";
import commentIcon from "../assets/icons/comment.png";
import bookmark from "../assets/icons/bookmark.png";
import emojiIcon from "../assets/icons/emoji-icon.png";
import shareIcon from "../assets/icons/share.png";
import { useAppSelector } from '../hooks/reduxHooks';

interface IEPostCard{
  postData:any;
}

function PostCard({ postData }: IEPostCard) {
  // const follow = useAppSelector(state => state.follow);
  // const user = follow.following.find(item => item.user_id === postData.followed_id);

  return (
    <div className="post-card-container">
      {/* <div className='post-card__header'>
        <img src={avatar} className="post-card__header-avatar" alt='user-profile-picture'/>
        <p>{user?.username}</p>
        <img src={settingIcon} className='post-card__header-settings'/>
      </div>
      <div className='post-card__body'>
        <img src={postData.image_url} className="post-card__body-post" />
        <div className='post-card__body-icons-container'>
          <img src={heartIcon_uncheck} alt='like post' />
          <img src={commentIcon} alt='comment section' />
          <img src={shareIcon} alt='share' />
          <img src={bookmark} alt='save post' />
        </div>
      </div>
      <div className='post-card__details'>
        <div className='post-card__details-caption'>
          <h4>{user?.username}</h4>
          <p>{postData.caption}</p>
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
      </div> */}
    </div>
  );
}

export default PostCard;