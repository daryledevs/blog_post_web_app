import React from 'react'
import { useNavigate } from 'react-router';
import SidebarRenderIcon from './SidebarRenderIcon';
import SidebarIconName from './SidebarIconName';

interface SidebarProps {
  item: any;
  avatar: string;
  isClicked: any;
  username: string;
  setClickedLink: React.Dispatch<React.SetStateAction<any>>;
}

function SidebarTabCard({ avatar, item, isClicked, username, setClickedLink }: SidebarProps) {
  const navigate = useNavigate();

  const navigateHandler = (item: any) => {
    if (item.link === "/profile") {
      const link = `/${username}`;
      setClickedLink(item.name);
      navigate(link);
    } else if (item.link !== "none") {
      setClickedLink(item.link);
      navigate(item.link);
    } else {
      setClickedLink(item.name);
    }
  };

  return (
    <li>
      <div onClick={() => navigateHandler(item)}>
        <SidebarRenderIcon
          profileSrc={avatar}
          isProfile={item.name === "Profile"}
          IconComponent={isClicked ? item.icon.check : item.icon.uncheck}
        />
        <SidebarIconName name={item.name} />
      </div>
    </li>
  );
}

export default SidebarTabCard;
