import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import FollowLists from "shared/components/FollowLists";
import FollowModalTitle from "shared/components/FollowModalTitle";
import { useGetFollowersAndFollowingListsMutation, useGetUserDataQuery } from "redux/api/userApi";

function FollowModal() {
  const { state } = useLocation();
  const userApiData = useGetUserDataQuery({ person: state.username ? state.username : "" });
  const [fetchFollowsLists, { data: follows, isLoading }] = useGetFollowersAndFollowingListsMutation();
  const [removedUsers, setRemovedUsers] = useState<Array<number>>([]);
  
  useEffect(() => {
    if(userApiData.isLoading) return;
    const { user_id } = userApiData.data?.user;
    fetchFollowsLists({ user_id: user_id, fetch: state.fetch, listsId: 0 });
  }, [userApiData.data]);

  return (
    <div className="follow-modal__container">
      <div className="follow-modal__parent">
        <FollowModalTitle state={state} />
        <div className="follow-modal__list-container">
          <FollowLists
            isLoading={isLoading}
            lists={follows?.lists}
            state={state}
            removedUsers={removedUsers}
            setRemovedUsers={setRemovedUsers}
          />
        </div>
      </div>
    </div>
  );
}

export default FollowModal;
