import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import avatar from "../../assets/icons/avatar.png";
import closeIcon from "../../assets/icons/x_icon.png";
import { useAppSelector } from "../../redux/hooks/hooks";
import { updateList } from "../../redux/reducer/follower";
import api from "../../assets/data/api";

function FollowModal({ user, list, name, close }: any) {
  const dispatch = useDispatch();
  const follows = useAppSelector((state) => state.follow);
  const propertyName = name.toLowerCase();
  const data = follows[propertyName];
  const total = follows.total[propertyName];
  const [unfollow, setUnfollow] = useState<any>([]);
  const [initial, setInitial] = useState<any>(list);
  const [baseData, setBaseData] = useState<any>(list);

  const isFollowed = (user: any) => baseData.includes(user);
  const isFollowers = () => name === "Followers" ? true : false;

  function textBtn(followed_id: any, follower_id: any) {
    const rmvBtn = isFollowers() ? "Remove" : "Following";
    const params = { followed_id, follower_id };
    const found = baseData.find((item:any) => conditionHandler(item, params, "find"));
    const isFound = isFollowed(found);
    const isUnfollow = unfollow.includes(found);
   
    if (isFound && !isUnfollow) {
      return (
        <button
          onClick={() => followHandler(isFound, isUnfollow, params)}
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
              onClick={() => followHandler(isFound, isUnfollow, params)}
              className="item-card__flw-btn"
            >
              Follow
            </button>
          )}
        </>
      );
    }
  };

  const conditionHandler = (item: any, params:any, method = "") => {
    const conditionOne = item.follower_id === params.follower_id;
    const conditionTwo = item.followed_id === params.followed_id;
    if(method === "find") return isFollowers() ? conditionOne : conditionTwo;
    return isFollowers() ? !conditionOne : !conditionTwo;
  };

  async function followHandler(isFound: any, isUnfollow:any, params:any) {
    let instance = [...data];
    let original = initial;
    let overall = total;
    const remove = baseData.find((item:any) => conditionHandler(item, params, "find"));
    const filter = unfollow.filter((item:any) => conditionHandler(item, params));
    const found = unfollow.find((item:any) => conditionHandler(item, params, "find"));

    try {
      await api.get(`/follow/${params.followed_id}/${params.follower_id}`);
      if(isFound && !isUnfollow){
        setUnfollow([...unfollow, { ...remove }]);
        let idx = instance.indexOf(remove);
        if(idx > -1) instance.splice(idx, 1);
        else instance.pop();
        overall -= 1;
      } else {
        let idx = instance.indexOf(found);
        instance.splice(idx, 0, found);
        setInitial(original);
        setUnfollow(filter);
        overall += 1;
      }
    } catch (error) {
      console.log(error);
    }

    setBaseData(instance);

    dispatch(
      updateList({
        name: propertyName,
        value: instance,
        total: overall,
      })
    );
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
