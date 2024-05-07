import { useNavigate }     from "react-router-dom";
import ProfileSocialStats  from "./ProfileSocialStats";

import { ProfileProps }    from "@/interfaces/types";
import useUserDetailsStats from "@/hooks/useUserDetailsStats";

interface ProfileUserStatsProps extends ProfileProps {
  className?: string;
};

function ProfileUserStats({ user, className }: ProfileUserStatsProps) {
  const navigate = useNavigate();
  
  const { 
    totalPosts, 
    followers, 
    following, 
    isLoading, 
    isFetching 
  } = useUserDetailsStats({ user_id: user.user_id });
  
  if (isLoading || isFetching) return null;

  return (
    <div className={`profile-user-stats ${className}`}>
      <ProfileSocialStats
        count={totalPosts}
        label="posts"
      />
      <ProfileSocialStats
        count={followers}
        label="followers"
        onClick={() => navigate(`/${user.username}/followers`)}
      />
      <ProfileSocialStats
        count={following}
        label="following"
        onClick={() => navigate(`/${user.username}/following`)}
      />
    </div>
  );
}

export default ProfileUserStats;
