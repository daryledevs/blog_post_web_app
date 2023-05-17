import React, { useState } from 'react'
import burger from "../../assets/icons/hamburger.png";
import Links from "../../assets/data/nav_links";
import logo from "../../assets/images/dee-logo.png";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from '../../redux/hooks/hooks';

interface IProps {
  clickedLink: string;
  setClickedLink: (message: string) => void;
}

function Sidebar({ clickedLink, setClickedLink }: IProps) {
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.user);
  const isProfile = (item:any) => item.link === "/profile" ? `/${userData.username}` : item.link;

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
            console.log(item.name, clickedLink);
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