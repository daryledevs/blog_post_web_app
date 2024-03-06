import React from "react";
import ProfileGallery from "../components/ProfileGallery";
import ProfileHeader from "../components/ProfileHeader";
import { Outlet, useParams } from "react-router-dom";
import { useGetUserDataQuery, } from "../redux/api/userApi";
import { useGetUserPostQuery, } from "../redux/api/postApi";

function Profile() {
  const { username } = useParams();

  // services
  const { data, isLoading } = useGetUserDataQuery({ person: username || "" });
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
