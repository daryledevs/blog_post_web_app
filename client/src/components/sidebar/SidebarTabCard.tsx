import React             from 'react'
import { useNavigate }   from 'react-router';
import SidebarRenderIcon from './SidebarRenderIcon';
import SidebarIconName   from './SidebarIconName';
import { ClickedLink }   from '@/pages/Index';

interface SidebarProps {
  item: any;
  avatar: string;
  username: string;
  isClicked: boolean;
  clickedLink: ClickedLink;
  setClickedLink: React.Dispatch<React.SetStateAction<ClickedLink>>;
}

function SidebarTabCard({
  avatar,
  item,
  isClicked,
  username,
  clickedLink,
  setClickedLink,
}: SidebarProps) {
  const navigate = useNavigate();

  const navigateHandler = (item: any) => {
    if (item.link === "/profile") {
      const link = `/${username}`;
      navigate(link);
      setClickedLink({ previous: clickedLink.current, current: item.name });
    } else if (item.link !== "none") {
      navigate(item.link);
      setClickedLink({ previous: clickedLink.current, current: item.link });
    } else {
      if (clickedLink.current === item.name) {
        setClickedLink({ previous: "", current: clickedLink.previous });
      } else {
        setClickedLink({ previous: clickedLink.current, current: item.name });
      }
      
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
