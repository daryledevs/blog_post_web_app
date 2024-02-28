import React from "react";

type ProfileHeaderDetailsStatsProps = {
  count: number;
  label: string;
  onClick?: () => void;
  styles?: React.CSSProperties;
};

function ProfileHeaderDetailsStats({
  count,
  label,
  onClick,
  styles,
}: ProfileHeaderDetailsStatsProps) {
  return (
    <p
      onClick={onClick}
      style={styles}
    >
      {count} {label}
    </p>
  );
}

export default ProfileHeaderDetailsStats;
