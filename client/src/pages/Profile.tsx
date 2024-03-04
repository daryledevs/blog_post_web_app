import React from "react";
import ProfileGallery from "../components/ProfileGallery";
import ProfileHeader from "../components/ProfileHeader";
import { Outlet, useLocation } from "react-router-dom";
import { useGetUserDataQuery, } from "../redux/api/userApi";
import { useGetUserPostQuery, useGetUserTotalPostsQuery, } from "../redux/api/postApi";

function Profile() {
  const { state } = useLocation();
  const person = state?.username ? state.username : "";

  // services
  const userDataApi = useGetUserDataQuery({ person });

  const args = {
    first: { user_id: userDataApi.data?.user.user_id },
    second: { skip: !userDataApi.data },
  };

  const postDataApi = useGetUserPostQuery(args.first, args.second);
  const totalPostsApi = useGetUserTotalPostsQuery(args.first, args.second);

  if (
    userDataApi.isLoading ||
    postDataApi.isLoading ||
    totalPostsApi.isLoading ||
    !userDataApi.data
  )
    return null;

  return (
    <React.Fragment>
      <Outlet />
      <div className="profile__container">
        <ProfileHeader user={userDataApi.data.user} />
        <ProfileGallery posts={postDataApi.data} />
      </div>
    </React.Fragment>
  );
}

export default Profile;
