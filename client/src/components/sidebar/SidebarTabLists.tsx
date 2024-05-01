
import { ClickedLink } from "pages/Index";
import Links from "../../shared/constants/nav_links";
import SidebarTabCard from "./SidebarTabCard";

type SidebarTabListsProps = {
  avatar: string;
  username: string;
  clickedLink: ClickedLink;
  setClickedLink: React.Dispatch<React.SetStateAction<ClickedLink>>;
};

function SidebarTabLists({ avatar, clickedLink, username, setClickedLink } : SidebarTabListsProps) {
  
  return Links.map((item: any, index: any) => {
    const { name, link } = item;
    const isClicked = [link, name].includes(clickedLink.current);
    
    return (
      <SidebarTabCard
        key={index}
        item={item}
        avatar={avatar}
        username={username}
        isClicked={isClicked}
        clickedLink={clickedLink}
        setClickedLink={setClickedLink}
      />
    );
  });
}

export default SidebarTabLists
