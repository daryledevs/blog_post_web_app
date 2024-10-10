import React from 'react'

interface RenderIconProps {
  isProfile: boolean;
  profileSrc: string | null | undefined;
  IconComponent: React.FC;
}

const SidebarRenderIcon: React.FC<RenderIconProps> = ({ isProfile, profileSrc, IconComponent }) => {
  return (
    <React.Fragment>
      {isProfile && profileSrc ? (
        <img alt="profile picture" src={profileSrc} />
      ) : (
        <IconComponent />
      )}
    </React.Fragment>
  );
}

export default SidebarRenderIcon