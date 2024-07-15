import { useNavigate }     from "react-router-dom";
import ProfileSocialStats  from "./ProfileSocialStats";
import useUserDetailsStats from "@/hooks/useUserDetailsStats";

interface ProfileUserStatsProps {
  user_id: string | undefined;
  username: string | undefined;
  className?: string;
};

function ProfileUserStats({ user_id, username, className }: ProfileUserStatsProps) {
  const navigate = useNavigate();
  
  const { 
    totalPosts, 
    followers, 
    following, 
    isLoading, 
    isFetching 
  } = useUserDetailsStats({ user_id: user_id });
  
  if (isLoading || isFetching) return null;

  return (
    <div className={`profile-user-stats ${className}`}>
      <ProfileSocialStats
        count={totalPosts || 0}
        label="posts"
      />
      <ProfileSocialStats
        count={followers || 0}
        label="followers"
        onClick={() => navigate(`/${username}/followers`)}
      />
      <ProfileSocialStats
        count={following || 0}
        label="following"
        onClick={() => navigate(`/${username}/following`)}
      />
    </div>
  );
}

export default ProfileUserStats;
