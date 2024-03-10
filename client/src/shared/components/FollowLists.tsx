import React, { useEffect } from "react";
import FollowUserCard from "./FollowUserCard";
import { useFollowUserMutation } from "redux/api/userApi";

type FollowListsProps = {
  path: string;
  lists: any;
  follower_id: number;
  isLoading: boolean;
  removedUsers: any;
  setRemovedUsers: React.Dispatch<React.SetStateAction<any>>;
};

function FollowLists({
  path,
  lists,
  follower_id,
  isLoading,
  removedUsers,
  setRemovedUsers,
}: FollowListsProps) {
  const [followUser, followUserApi] = useFollowUserMutation({ fixedCacheKey: "follows-api" });

  function followUserHandler(userFollowId: number) {
    if(!follower_id) return null;
    const listsCopy = [...lists];
    
    // if the user is in the list of removed users
    if (removedUsers.includes(userFollowId)) {
      // we remove from the list of removed users
      followUser({ follower_id, followed_id: userFollowId });
      setRemovedUsers((prev: any) => prev.filter((id: number) => id !== userFollowId));
      return;
    } 

    // if the user is not in the list of removed users
    if (!removedUsers.includes(userFollowId)) {
      // we add to the list of removed users
      setRemovedUsers((prev: any) => [...prev, userFollowId]);
      followUser({ follower_id: userFollowId, followed_id: follower_id });
      return;
    }
  }

  useEffect(() => {
    console.log(followUserApi?.data?.message)
  }, [followUserApi.data]);

  if (isLoading) return null;

  return (
    <React.Fragment>
      {lists?.map((item: any, index: number) => (
        <FollowUserCard
          key={index}
          item={item}
          path={path}
          removedUsers={removedUsers}
          onClick={followUserHandler}
        />
      ))}
    </React.Fragment>
  );
}

export default FollowLists;
