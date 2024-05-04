import React, { useCallback }    from "react";
import FollowUserCard            from "./FollowUserCard";
import { useFollowUserMutation } from "@/redux/api/userApi";

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
  const [followUser] = useFollowUserMutation({ fixedCacheKey: "follows-api" });

  const followUserHandler = useCallback(
    (userFollowId: number) => {
      const userInRemoved = removedUsers.includes(userFollowId);
      const isUserInList = (user_id: number) => user_id === userFollowId;
      const userInList = lists?.some(
        (item: any) =>
          isUserInList(item.follower_id) || isUserInList(item.followed_id)
      );

      if (!userInRemoved && userInList) {
        setRemovedUsers((prev: number[]) => [...prev, userFollowId]);
      } else {
        setRemovedUsers((prev: number[]) =>
          prev.filter((id) => id !== userFollowId)
        );
      }

      const argOne = path === "following" ? follower_id : userFollowId;
      const argTwo = path === "following" ? userFollowId : follower_id;
      followUser({ follower_id: argOne, followed_id: argTwo });
    },
    [lists, removedUsers, setRemovedUsers]
  );

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
