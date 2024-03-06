import React from "react";
import FollowUserCard from "./FollowUserCard";

type FollowListsProps = {
  isLoading: boolean;
  lists: any;
  state: any;
  removedUsers: any;
  setRemovedUsers: React.Dispatch<React.SetStateAction<any>>;
};

function FollowLists({
  isLoading,
  lists,
  state,
  removedUsers,
  setRemovedUsers,
}: FollowListsProps) {
  function removeUserHandler(userFollowId: number) {
    setRemovedUsers((prev: any) => [...prev, userFollowId]);
  }

  function addUserHandler(userFollowId: number) {
    setRemovedUsers((prev: any) =>
      prev.filter((id: number) => id !== userFollowId)
    );
  }

  if (isLoading) return null;

  return (
    <React.Fragment>
      {lists?.map((item: any, index: number) => (
        <FollowUserCard
          key={index}
          item={item}
          state={state}
          removedUsers={removedUsers}
          removeUserHandler={removeUserHandler}
          addUserHandler={addUserHandler}
        />
      ))}
    </React.Fragment>
  );
}

export default FollowLists;
