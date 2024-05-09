import { useNavigate }                  from 'react-router';
import { useDispatch, useSelector }     from 'react-redux';
import { navigatedPage, selectSidebar } from '@/redux/slices/sidebarSlice';

import SidebarRenderIcon                from './SidebarRenderIcon';
import SidebarIconName                  from './SidebarIconName';

export interface SidebarProps {
  item: any;
  avatar: string;
  username: string;
  isClicked: boolean;
}

function SidebarTabCard({
  avatar,
  item,
  isClicked,
  username,
}: SidebarProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarState = useSelector(selectSidebar);

  const dispatchHandler = (previous: string, current: string) => {
    dispatch(
      navigatedPage({
        previous: previous,
        current: current,
      })
    );
  };

  // Determine the link based on the item
  const navigateHandler = (item: any) => {
    const profilePage = `/${username}`;
    const profileLink = "/profile";

    // If the item link is "/profile", set the link to the username
    const link = item.link === profileLink ? profilePage : item.link;
    const name = item.name;

    // If the link is "/profile" or the link is not "Create" or "Search",
    // navigate to the page's link
    if (link === "/profile" || link !== "none") {
      navigate(link);
      return dispatchHandler(
        sidebarState.current,
        link === "/profile" ? name : link
      );
    }

    // If the item is "Create" or "Search",
    // then close the current view and navigate to the previous view
    if (sidebarState.current === name) {
      return dispatchHandler(sidebarState.current, sidebarState.previous);
    }

    // Navigation for "Create" or "Search" view
    dispatchHandler(sidebarState.current, name);
  };

  return (
    <li className="sidebar-tab-card">
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
