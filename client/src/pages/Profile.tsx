import React                    from "react";
import { Outlet, useParams }    from "react-router-dom";

import Gallery                  from "@/components/profile/profile-gallery/Gallery";
import ProfileHeader            from "@/components/profile/ProfileHeader";
import ProfileUserInfo          from "@/components/profile/ProfileUserInfo";

import { useGetUserPostQuery, } from "@/redux/api/postApi";
import useFetchUserDataByUsername from "@/hooks/useFetchUserDataByUsername";

function Profile() {
  const { username } = useParams();

  // services
  const { user, isLoading } = useFetchUserDataByUsername({ username });

  const postDataApi = useGetUserPostQuery(
    { userUuid: user?.uuid ?? "" },
    { skip: !user }
  );

  if (
    isLoading || 
    postDataApi.isLoading ||
    !user
  ) return null;

  return (
    <React.Fragment>
      <Outlet />
      <div className="profile">
        <div className="profile__container">
          <ProfileHeader />
          <ProfileUserInfo />
          <Gallery posts={postDataApi?.data?.posts} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Profile;
