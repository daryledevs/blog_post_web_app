import React, { useCallback }    from "react";
import { useFollowUserMutation } from "@/redux/api/userApi";
import FollowUserCard            from "./FollowUserCard";

type FollowListsProps = {
  path: string;
  lists: any;
  followerUuid: string | undefined;
  isLoading: boolean;
  removedUsers: any;
  setRemovedUsers: React.Dispatch<React.SetStateAction<any>>;
};

function FollowLists({
  path,
  lists,
  followerUuid,
  isLoading,
  removedUsers,
  setRemovedUsers,
}: FollowListsProps) {
  const [followUser] = useFollowUserMutation({ fixedCacheKey: "follows-api" });

  const followUserHandler = useCallback(
    (userFollowUuid: string) => {
      const userInRemoved = removedUsers.includes(userFollowUuid);
      const isUserInList = (userUuid: string) => userUuid === userFollowUuid;
      const userInList = lists?.some(
        (item: any) =>
          isUserInList(item.followerUuid) || isUserInList(item.followedUuid)
      );

      if (!userInRemoved && userInList) {
        setRemovedUsers((prev: string[]) => [...prev, userFollowUuid]);
      } else {
        setRemovedUsers((prev: string[]) =>
          prev.filter((id) => id !== userFollowUuid)
        );
      }

      const argOne = path === "following" ? followerUuid : userFollowUuid;
      const argTwo = path === "following" ? userFollowUuid : followerUuid;
      
      if (argOne && argTwo) {
        followUser({ followerUuid: argOne, followedUuid: argTwo });
      }
    },
    [followerUuid, lists, removedUsers, setRemovedUsers]
  );

  if (isLoading) return null;

  return (
    <React.Fragment>
      {lists?.map((item: any, index: string) => (
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
