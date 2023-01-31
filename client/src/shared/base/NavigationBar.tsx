import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import logo from "../../assets/images/dee-logo.png";
import burger from "../../assets/icons/hamburger.png";
import home_check from "../../assets/icons/house_check.png";
import home_uncheck from "../../assets/icons/house_uncheck.png";
import search_check from "../../assets/icons/search_check.png";
import search_uncheck from "../../assets/icons/search_uncheck.png";
import explore_check from "../../assets/icons/explore_check.png";
import explore_uncheck from "../../assets/icons/explore_uncheck.png";
import message_check from "../../assets/icons/message_check.png";
import message_uncheck from "../../assets/icons/message_uncheck.png";
import create_check from "../../assets/icons/create_post_check.png";
import create_uncheck from "../../assets/icons/create_post_uncheck.png";
import avatar from "../../assets/icons/avatar.png";

function NavigationBar() {
  const [clickedLink, setClickedLink] = useState("");

  let nav_links: any = [
    {
      name: "Home",
      icon: {
        check: home_check,
        uncheck: home_uncheck,
      },
    },
    {
      name: "Search",
      icon: {
        check: search_check,
        uncheck: search_uncheck,
      },
    },
    {
      name: "Explore",
      icon: {
        check: explore_check,
        uncheck: explore_uncheck,
      },
    },
    {
      name: "Message",
      icon: {
        check: message_check,
        uncheck: message_uncheck,
      },
    },
    {
      name: "Create",
      icon: {
        check: create_check,
        uncheck: create_uncheck,
      },
    },
    {
      name: "Profile",
      icon: {
        check: avatar,
      },
    },
  ];

  nav_links = nav_links.map((item: any, index: any) => {
    return (
      <li key={index}>
        <div onClick={() => setClickedLink(item.name)}>
          <img
            src={
              item.name === "Profile"
                ? item.icon.check
                : clickedLink === item.name
                ? item.icon.check
                : item.icon.uncheck
            }
          />
          <span>{item.name}</span>
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