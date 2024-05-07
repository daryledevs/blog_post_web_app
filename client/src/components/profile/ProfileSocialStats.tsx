import React from "react";

type ProfileSocialStatsProps = {
  count: number;
  label: string;
  onClick?: () => void;
  styles?: React.CSSProperties;
};

function ProfileSocialStats({
  count,
  label,
  onClick,
  styles,
}: ProfileSocialStatsProps) {
  return (
    <div
      onClick={onClick}
      className="profile-social-stats"
    >
      <p>{count}</p>
      <p>{label}</p>
    </div>
  );
}

export default ProfileSocialStats;
