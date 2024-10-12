import {
  useGetFollowersAndFollowingListsMutation,
}                                 from "@/redux/api/userApi";

import { useState, useEffect }    from "react";
import { useLocation, useParams } from "react-router";

import FollowLists                from "@/shared/components/follow-modal/FollowLists";
import FollowModalTitle           from "@/shared/components/follow-modal/FollowModalTitle";
import useFetchUserDataByUsername from "@/hooks/useFetchUserDataByUsername";

function FollowModal() {
  const { username } = useParams();
  const location = useLocation();
  const pathType = location?.pathname?.split("/")[2];
  
  const { user, isLoading: isUserLoading } = useFetchUserDataByUsername({ username });
  const [removedUsers, setRemovedUsers] = useState<Array<number>>([]);
  const userUuid = user?.uuid;

  const [fetchFollowsLists, { data: follows, isLoading }] =
    useGetFollowersAndFollowingListsMutation();

  useEffect(() => {
    if (isUserLoading || !userUuid) return;
    fetchFollowsLists({
      userUuid: userUuid,
      fetchFollowType: pathType,
      followListIds: [],
    });
  }, [userUuid, isUserLoading]);

  return (
    <div className="follow-modal__container">
      <div className="follow-modal__parent">
        <FollowModalTitle path={pathType} />
        <div className="follow-modal__list-container">
          <FollowLists
            path={pathType}
            followerUuid={userUuid}
            isLoading={isLoading}
            lists={follows?.followList}
            removedUsers={removedUsers}
            setRemovedUsers={setRemovedUsers}
          />
        </div>
      </div>
    </div>
  );
}

export default FollowModal;
