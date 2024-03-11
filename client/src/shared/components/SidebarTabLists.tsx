
import Links from "../constants/nav_links";
import SidebarTabCard from "./SidebarTabCard";

type SidebarTabListsProps = {
  avatar: string;
  clickedLink: string;
  username: string;
  setClickedLink: React.Dispatch<React.SetStateAction<any>>;
};

function SidebarTabLists({ avatar, clickedLink, username, setClickedLink } : SidebarTabListsProps) {
  
  return Links.map((item: any, index: any) => {
    const { name, link } = item;
    const isClicked = link === clickedLink || name === clickedLink;
    
    return (
      <SidebarTabCard
        key={index}
        item={item}
        avatar={avatar}
        username={username}
        isClicked={isClicked}
        setClickedLink={setClickedLink}
      />
    );
  });
}

export default SidebarTabLists
