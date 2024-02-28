import burger from "../../assets/icons/hamburger.png";
import Links from "../../assets/data/nav_links";
import logo from "../../assets/images/dee-logo.png";

import { useLocation, useNavigate } from "react-router-dom";
import { useGetUserDataQuery } from '../../redux/api/UserApi';

interface IProps {
  clickedLink: string;
  setClickedLink: (message: string) => void;
}

function Sidebar({ clickedLink, setClickedLink }: IProps) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const userDataApi = useGetUserDataQuery({ person: "" });

  if (userDataApi.isLoading || !userDataApi.data) return null;
  
  const isProfile = (item:any) => {
    if (item.link === "/profile"){
      const username = state?.username
        ? state.username
        : userDataApi.data?.user.username;
        
      return `/${username}`;
    } else {
      return item.link;
    }
  }
  
  const nav_links = Links.map((item: any, index: any) => {
    return (
      <li key={index}>
        <div
          onClick={() => {
            if (item.link !== "none") {
              const link = isProfile(item);
              setClickedLink(link);
              navigate(link);
              return;
            }
            setClickedLink(item.name);
          }}
        >
          <img
            alt=""
            src={
              item.link === "/profile"
                ? item.icon.check
                : clickedLink === item.name
                ? item.icon.check
                : clickedLink === item.link
                ? item.icon.check
                : item.icon.uncheck
            }
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
  });
  
  return (
    <div className="sidebar__container">
      <img
        src={logo}
        className="sidebar__logo"
        alt="social-media-logo"
      />
      <ul className="sidebar__links">{nav_links}</ul>
      <img
        src={burger}
        className="sidebar__burger"
        alt=''
      />
    </div>
  );
}

export default Sidebar