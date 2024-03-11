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

import Home from "../../assets/icons/svg/home.svg?react";
import Search from "../../assets/icons/svg/search.svg?react";
import Explore from "../../assets/icons/svg/explore.svg?react";
import Messenger from "../../assets/icons/svg/messenger.svg?react";
import Profile from "../../assets/icons/svg/profile.svg?react";
import Create from "../../assets/icons/svg/create.svg?react";

import HomeFilled from "../../assets/icons/svg/home-filled.svg?react";
import SearchFilled from "../../assets/icons/svg/search-filled.svg?react";
import ExploreFilled from "../../assets/icons/svg/explore-filled.svg?react";
import MessengerFilled from "../../assets/icons/svg/messenger-filled.svg?react";
import ProfileFilled from "../../assets/icons/svg/profile-filled.svg?react";
import CreateFilled from "../../assets/icons/svg/create-filled.svg?react";



let NAVIGATION_LINKS: any = [
  {
    name: "Home",
    link: "/",
    icon: {
      check: HomeFilled,
      uncheck: Home,
    },
  },
  {
    name: "Search",
    link: "none",
    icon: {
      check: SearchFilled,
      uncheck: Search,
    },
  },
  {
    name: "Explore",
    link: "/explore",
    icon: {
      check: ExploreFilled,
      uncheck: Explore,
    },
  },
  {
    name: "Message",
    link: "/message",
    icon: {
      check: MessengerFilled,
      uncheck: Messenger,
    },
  },
  {
    name: "Create",
    link: "none",
    icon: {
      check: CreateFilled,
      uncheck: Create,
    },
  },
  {
    name: "Profile",
    link: "/profile",
    icon: {
      check: ProfileFilled,
      uncheck: Profile,
    },
  },
];

export default NAVIGATION_LINKS;
