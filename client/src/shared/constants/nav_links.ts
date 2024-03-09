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

let nav_links: any = [
  {
    name: "Home",
    link: '/',
    icon: {
      check: home_check,
      uncheck: home_uncheck,
    },
  },
  {
    name: "Search",
    link: '/search',
    icon: {
      check: search_check,
      uncheck: search_uncheck,
    },
  },
  {
    name: "Explore",
    link: '/explore',
    icon: {
      check: explore_check,
      uncheck: explore_uncheck,
    },
  },
  {
    name: "Message",
    link: '/message',
    icon: {
      check: message_check,
      uncheck: message_uncheck,
    },
  },
  {
    name: "Create",
    link: 'none',
    icon: {
      check: create_check,
      uncheck: create_uncheck,
    },
  },
  {
    name: "Profile",
    link: '/profile',
    icon: {
      check: avatar,
    },
  },
];

export default nav_links;
