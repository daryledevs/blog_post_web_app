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
  const navigateHandler = (path: string, fetch: string, username:string) => navigate(path, { state: { fetch, username } })
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
          onClick={() => {
            const path = `/${user.username}/followers`;
            navigateHandler(path, "followers", user.username);
          }}
          styles={{ cursor: "pointer" }}
        />
        <ProfileHeaderDetailsStats
          count={following}
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
