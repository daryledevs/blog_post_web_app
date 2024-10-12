import { useParams } from "react-router-dom";
import useFetchUserDataByUsername from "@/hooks/useFetchUserDataByUsername";

function ProfileHeader() {
  const { username } = useParams();
  const { user, isLoading } = useFetchUserDataByUsername({ username });

  if (isLoading) return null;

  return (
    <div className="profile-header">
      <p>{user?.username}</p>
    </div>
  );
}

export default ProfileHeader;
