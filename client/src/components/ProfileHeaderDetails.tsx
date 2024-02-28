import { useNavigate } from "react-router-dom";
import { IEUserState } from "../redux/reduxIntface";
import ProfileHeaderDetailsStats from "./ProfileHeaderDetailsStats";

type ProfileHeaderDetailsProps = {
  user: IEUserState;
  followStats: { followers: number; following: number };
};

function ProfileHeaderDetails({ user, followStats }: ProfileHeaderDetailsProps) {
  const navigate = useNavigate();
  return (
    <div className="profile__header-details">
      <p>PROFILE</p>
      <h1 className="profile__header-username">{user?.username}</h1>
      <div className="profile__header-numbers">
        <ProfileHeaderDetailsStats
          count={0}
          label="Pictures"
        />
        <ProfileHeaderDetailsStats
          count={followStats.followers}
          label="Followers"
          onClick={() => null}
          styles={{ cursor: "pointer" }}
        />
        <ProfileHeaderDetailsStats
          count={followStats.following}
          label="Following"
          onClick={() => navigate("/admin", { state: { username: "admin" } })}
          styles={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default ProfileHeaderDetails;
