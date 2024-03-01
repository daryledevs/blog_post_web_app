import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import avatar from "../../assets/icons/avatar.png";
import closeIcon from "../../assets/icons/x_icon.png";
import { useAppSelector } from "../../hooks/reduxHooks";

function FollowModal({ user, list, name, close }: any) {
  const dispatch = useDispatch();
  const [unfollow, setUnfollow] = useState<any>([]);
  const [initial, setInitial] = useState<any>(list);
  const [baseData, setBaseData] = useState<any>(list);

  const isFollowed = (user: any) => baseData.includes(user);
  const isFollowers = () => name === "Followers" ? true : false;

  function textBtn(followed_id: any, follower_id: any) {
    const rmvBtn = isFollowers() ? "Remove" : "Following";
    const params = { followed_id, follower_id };
    const test = isFollowed(params);
    if (test) {
      return (
        <button
          onClick={() => null}
          className="item-card__rmv-btn"
        >
          {rmvBtn}
        </button>
      );
    } else {
      return (
        <>
          {isFollowers() ? (
            <button className="item-card__rmved-btn">Removed</button>
          ) : (
            <button
              onClick={() => null}
              className="item-card__flw-btn"
            >
              Follow
            </button>
          )}
        </>
      );
    }
  };

  return (
    <div className="follow-modal__container">
      <div className="follow-modal__parent">
        <div className="follow-modal__title">
          <p>{name}</p>
          <img
            alt=""
            onClick={close}
            src={closeIcon}
            width={29}
          />
        </div>
        <div className="follow-modal__list-container">
          {initial.map((item: any, index: number) => {

            return (
              <div
                className="item-card"
                key={index}
              >
                <img
                  alt=""
                  src={item.avatar_url ? item.avatar_url : avatar}
                  className="item-card__avatar"
                />
                <div className="item-card__item">
                  <div>
                    <p>{item.username}</p>
                    <p>{item.first_name} {item.last_name}</p>
                  </div>
                  {textBtn(item.followed_id, item.follower_id)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FollowModal;
