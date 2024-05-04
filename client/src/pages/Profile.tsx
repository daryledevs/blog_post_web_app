import React                    from "react";
import { Outlet, useParams }    from "react-router-dom";

import ProfileGallery           from "@/components/profile/ProfileGallery";
import ProfileHeader            from "@/components/profile/ProfileHeader";

import { useGetUserDataQuery, } from "@/redux/api/userApi";
import { useGetUserPostQuery, } from "@/redux/api/postApi";

function Profile() {
  const { username } = useParams();

  // services
  const { data, isLoading } = useGetUserDataQuery({ person: username || "" });

  const postDataApi = useGetUserPostQuery(
    { user_id: data?.user.user_id },
    { skip: !data?.user }
  );

  if (
    isLoading || 
    postDataApi.isLoading || 
    !data || 
    !postDataApi.data
  ) return null;

  return (
    <React.Fragment>
      <Outlet />
      <div className="profile__container">
        <div className="profile__parent">
          <ProfileHeader user={data.user} />
          <ProfileGallery posts={postDataApi.data} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Profile;
