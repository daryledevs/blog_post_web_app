import { useNavigate } from "react-router-dom";
import { IEUserState } from "../redux/reduxIntface";
import ProfileHeaderDetailsStats from "./ProfileHeaderDetailsStats";
import { useGetUserTotalPostsQuery } from "../redux/api/PostApi";
import { useGetFollowStatsQuery } from "../redux/api/UserApi";

type ProfileHeaderDetailsProps = {
  user: IEUserState;
};

function ProfileHeaderDetails({ user }: ProfileHeaderDetailsProps) {
  const navigate = useNavigate();
  const totalPostsApi = useGetUserTotalPostsQuery({ user_id: user.user_id });
  const followStatsDataApi = useGetFollowStatsQuery({ user_id: user.user_id });
  
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
          onClick={() => null}
          styles={{ cursor: "pointer" }}
        />
        <ProfileHeaderDetailsStats
          count={followStatsDataApi.data?.following}
          label="Following"
          onClick={() => navigate("/admin", { state: { username: "admin" } })}
          styles={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default ProfileHeaderDetails;
