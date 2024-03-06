import React from 'react'
import { useNavigate } from 'react-router';

interface SidebarProps {
  item: any;
  isClicked: any;
  username: string;
  setClickedLink: React.Dispatch<React.SetStateAction<any>>;
}

function SidebarLists({ item, isClicked, username, setClickedLink }: SidebarProps) {
  const navigate = useNavigate();

  const navigateHandler = (item: any) => {
    if (item.link === "/profile") {
      const link = `/${username}`;
      setClickedLink(link);
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
        <img
          alt=""
          src={isClicked ? item.icon.check : item.icon.uncheck}
        />
        <span
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          {item.name}
        </span>
      </div>
    </li>
  );
}

export default SidebarLists
