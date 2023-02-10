import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import logo from "../../assets/images/dee-logo.png";
import burger from "../../assets/icons/hamburger.png";
import Links from '../../assets/data/nav_links';

function NavigationBar() {
  const { hash, pathname, search } = useLocation();
  const [clickedLink, setClickedLink] = useState(pathname);
  const navigate = useNavigate();

  const nav_links = Links.map((item: any, index: any) => {
    return (
      <li key={index}>
        <div
          onClick={() => {
            if (item.link !== "none"){
              setClickedLink(item.link);
              navigate(item.link);
              return 
            };
            setClickedLink(item.name);
            console.log(item.name, clickedLink);
          }}
        >
          <img
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
    <div className="navigation-container">
      <div className="navigation-parent">
        <img src={logo} className="navigation-parent__logo" alt='Social-media-logo'/>
        <ul className='navigation-parent__links'>
          {nav_links}
        </ul>
        <img src={burger} className="navigation-parent__burger" />
      </div>
      <Outlet />
    </div>
  );
}

export default NavigationBar;