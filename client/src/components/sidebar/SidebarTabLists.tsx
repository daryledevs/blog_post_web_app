
import { useSelector }   from "react-redux";
import links             from "@/shared/constants/nav_links";
import { selectSidebar } from "@/redux/slices/sidebarSlice";
import SidebarTabCard    from "./SidebarTabCard";

type SidebarTabListsProps = {
  avatar: string;
  username: string;
};

function SidebarTabLists({ avatar, username } : SidebarTabListsProps) {
  const sidebarState = useSelector(selectSidebar);
  
  return links.map((item: any, index: any) => {
    const { name, link } = item;
    const isClicked = [link, name].includes(sidebarState.current);

    return (
      <SidebarTabCard
        key={index}
        item={item}
        avatar={avatar}
        username={username}
        isClicked={isClicked}
      />
    );
  });
}

export default SidebarTabLists
