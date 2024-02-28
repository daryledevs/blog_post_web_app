import { useState } from "react";
import ProfileGallery from "../components/ProfileGallery";
import ProfileHeader from "../components/ProfileHeader";
import { useGetUserDataQuery, useGetFollowStatsQuery, } from "../redux/api/UserApi";
import { useLocation } from "react-router-dom";
import { useGetUserPostQuery } from "../redux/api/PostApi";

function Profile() {
  const { state } = useLocation();

  // services
  const userDataApi = useGetUserDataQuery({
    person: state?.username ? state.username : "",
  });

  const followStatsDataApi = useGetFollowStatsQuery(
    { user_id: userDataApi.data?.user.user_id },
    { skip: !userDataApi.data }
  );

  const postDataApi = useGetUserPostQuery(
    { user_id: userDataApi.data?.user.user_id },
    { skip: !userDataApi.data }
  );

  if (
    userDataApi.isLoading ||
    followStatsDataApi.isLoading ||
    postDataApi.isLoading ||
    !userDataApi.data
  )
    return null;

  return (
    <div className="profile__container">
      <ProfileHeader
        user={userDataApi.data.user}
        followStats={followStatsDataApi.data}
      />
      <ProfileGallery
        posts={postDataApi.data}
      />
    </div>
  );
}

export default Profile;
