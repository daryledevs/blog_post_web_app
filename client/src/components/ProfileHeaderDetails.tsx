import { useNavigate } from "react-router-dom";
import { IEUserState } from "../interfaces/interface";
import ProfileHeaderDetailsStats from "./ProfileHeaderDetailsStats";
import { useGetUserTotalPostsQuery } from "../redux/api/postApi";
import { useGetFollowStatsQuery } from "../redux/api/userApi";

type ProfileHeaderDetailsProps = {
  user: IEUserState;
};

function ProfileHeaderDetails({ user }: ProfileHeaderDetailsProps) {
  const navigate = useNavigate();
  const totalPostsApi = useGetUserTotalPostsQuery({ user_id: user.user_id });
  const followStatsDataApi = useGetFollowStatsQuery({ user_id: user.user_id });
  const navigateHandler = (path: string, fetch: string, username:string) => navigate(path, { state: { fetch, username } })
  if(totalPostsApi.isLoading || totalPostsApi.isLoading) return null;
  
  return (
    <div className="profile__header-details">
      <p>PROFILE</p>
      <h1 className="profile__header-username">{user?.username}</h1>
      <div className="profile__header-numbers">
        <ProfileHeaderDetailsStats
          count={totalPostsApi.data?.totalPost}
          label="Pictures"
        />
        <ProfileHeaderDetailsStats
          count={followStatsDataApi.data?.followers}
          label="Followers"
          onClick={() => {
            const path = `/${user.username}/followers`;
            navigateHandler(path, "followers", user.username);
          }}
          styles={{ cursor: "pointer" }}
        />
        <ProfileHeaderDetailsStats
          count={followStatsDataApi.data?.following}
          label="Following"
          onClick={() => {
            const path = `/${user.username}/following`;
            navigateHandler(path, "following", user.username);
          }}
          styles={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default ProfileHeaderDetails;
