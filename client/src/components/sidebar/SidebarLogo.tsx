import React from "react";
import InstagramText from "@/assets/images/instagram-logo.svg?react";
import InstagramLogo from "@/assets/icons/svg/instagram-logo.svg?react";

function SidebarLogo() {
  return (
    <div>
      <InstagramText className="sidebar__logo-text" />
      <InstagramLogo className="sidebar__logo-icon" />
    </div>
  );
}

export default SidebarLogo;
