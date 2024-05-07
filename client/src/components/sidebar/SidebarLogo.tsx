import InstagramText from "@/assets/images/instagram-logo.svg?react";
import InstagramLogo from "@/assets/icons/svg/instagram-logo.svg?react";

function SidebarLogo() {
  return (
    <div className="sidebar-logo">
      <InstagramText className="sidebar-logo__text" />
      <InstagramLogo className="sidebar-logo__icon" />
    </div>
  );
}

export default SidebarLogo;
