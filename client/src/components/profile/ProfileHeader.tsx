import { useParams }           from "react-router-dom";
import { useGetUserDataQuery } from "@/redux/api/userApi";

function ProfileHeader() {
  const { username } = useParams();
  const { data } = useGetUserDataQuery({ person: username || "" });

  return (
    <div className="profile-header">
      <p>{data?.user?.username}</p>
    </div>
  );
}

export default ProfileHeader;
