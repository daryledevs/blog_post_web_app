
import Links from "../constants/nav_links";
import SidebarTabCard from "./SidebarTabCard";

type SidebarTabListsProps = {
  clickedLink: string;
  username: string;
  setClickedLink: React.Dispatch<React.SetStateAction<any>>;
};

function SidebarTabLists({ clickedLink, username, setClickedLink } : SidebarTabListsProps) {
  return Links.map((item: any, index: any) => {
    const { name, link } = item;
    const isClicked = link === "/profile" || [name, link].includes(clickedLink);

    return (
      <SidebarTabCard
        key={index}
        item={item}
        isClicked={isClicked}
        username={username}
        setClickedLink={setClickedLink}
      />
    );
  });
}

export default SidebarTabLists
