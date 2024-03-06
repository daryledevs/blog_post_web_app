import { useNavigate } from "react-router-dom";
import { IEUserState } from "../interfaces/interface";
import ProfileHeaderDetailsStats from "./ProfileHeaderDetailsStats";
import useUserDetailsStats from "hooks/useUserDetailsStats";

type ProfileHeaderDetailsProps = {
  user: IEUserState;
};

function ProfileHeaderDetails({ user }: ProfileHeaderDetailsProps) {
  const navigate = useNavigate();
  const { totalPosts, followers, following, isLoading, isFetching } = useUserDetailsStats({ user_id: user.user_id });
  if (isLoading || isFetching) return null;

  return (
    <div className="profile__header-details">
      <p>PROFILE</p>
      <h1 className="profile__header-username">{user?.username}</h1>
      <div className="profile__header-numbers">
        <ProfileHeaderDetailsStats
          count={totalPosts}
          label="Pictures"
        />
        <ProfileHeaderDetailsStats
          count={followers}
          label="Followers"
          onClick={() => navigate(`/${user.username}/followers`)}
          styles={{ cursor: "pointer" }}
        />
        <ProfileHeaderDetailsStats
          count={following}
          label="Following"
          onClick={() => navigate(`/${user.username}/following`)}
          styles={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default ProfileHeaderDetails;
