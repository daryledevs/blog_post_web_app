import React from "react";
import ProfileGallery from "../components/ProfileGallery";
import ProfileHeader from "../components/ProfileHeader";
import { Outlet, useLocation } from "react-router-dom";
import { useGetUserDataQuery, } from "../redux/api/userApi";
import { useGetUserPostQuery, } from "../redux/api/postApi";

function Profile() {
  const { state } = useLocation();
  const person = state?.username ? state.username : "";

  // services
  const { data, isLoading } = useGetUserDataQuery({ person });
  const postDataApi = useGetUserPostQuery({ user_id: data?.user.user_id }, { skip: !data?.user });

  if (isLoading || postDataApi.isLoading || !data || !postDataApi.data) return null;
    
  return (
    <React.Fragment>
      <Outlet />
      <div className="profile__container">
        <ProfileHeader user={data.user} />
        <ProfileGallery posts={postDataApi.data} />
      </div>
    </React.Fragment>
  );
}

export default Profile;
