import InstagramText     from "@/assets/images/instagram-logo.svg?react";
import InstagramLogo     from "@/assets/icons/svg/instagram-logo.svg?react";
import { useSelector }   from "react-redux";
import { selectSidebar } from "@/redux/slices/sidebarSlice";

function SidebarLogo() {
  const sidebarState = useSelector(selectSidebar);
  const current = sidebarState.current;

  return (
    <div className="sidebar-logo">
      <InstagramLogo className="sidebar-logo__icon" />
      {current === "Search" ? (
        <InstagramLogo 
          className="sidebar-logo__icon sidebar-logo__icon-search-active" 
        />
      ) : (
        <InstagramText className="sidebar-logo__text" />
      )}
    </div>
  );
}

export default SidebarLogo;
