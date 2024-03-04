import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import avatar from "../../assets/icons/avatar.png";
import closeIcon from "../../assets/icons/x_icon.png";
import { useLocation, useNavigate } from "react-router";
import { useGetFollowersAndFollowingListsMutation, useGetUserDataQuery } from "redux/api/userApi";

function FollowModal({ user, list, name, close }: any) {
  const { state } = useLocation();
  const navigate = useNavigate()
  const userApiData = useGetUserDataQuery({ person: state.username ? state.username : "" });
  const [fetchFollowsLists, followListsApiData] = useGetFollowersAndFollowingListsMutation();

  const [initial, setInitial] = useState<any>(list);
  const [baseData, setBaseData] = useState<any>(list);

  const isFollowed = (user: any) => baseData?.includes(user);
  const isFollowers = () => name === "Followers" ? true : false;
  
  useEffect(() => {
    if(userApiData.isLoading) return;
    const { user_id } = userApiData.data?.user;
    fetchFollowsLists({ user_id: user_id, fetch: state.fetch, listsId: 0 });
  }, [userApiData.data]);

  useEffect(() => {
    console.log(followListsApiData);
  }, [followListsApiData.data]);

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

  if(followListsApiData.isLoading || userApiData.isLoading) return null;

  return (
    <div className="follow-modal__container">
      <div className="follow-modal__parent">
        <div className="follow-modal__title">
          <p>{name}</p>
          <img
            alt=""
            onClick={() => navigate(-1)}
            src={closeIcon}
            width={29}
          />
        </div>
        <div className="follow-modal__list-container">
          {followListsApiData.data?.lists?.map((item: any, index: number) => {
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
                    <p>
                      {item.first_name} {item.last_name}
                    </p>
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
