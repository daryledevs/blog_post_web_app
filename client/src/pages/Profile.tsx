import React                    from "react";
import { Outlet, useParams }    from "react-router-dom";

import Gallery                  from "@/components/profile/profile-gallery/Gallery";
import ProfileHeader            from "@/components/profile/ProfileHeader";
import ProfileUserInfo          from "@/components/profile/ProfileUserInfo";

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
      <div className="profile">
        <div className="profile__container">
          <ProfileHeader user={data.user} />
          <ProfileUserInfo user={data.user} />
          <Gallery posts={postDataApi.data} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Profile;
