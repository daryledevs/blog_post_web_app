
import { useGetUserDataQuery } from '../../redux/api/userApi';
import SidebarBurger from './SidebarBurger';
import SidebarLogo from "./SidebarLogo";
import SidebarTabLists from "./SidebarTabLists";

interface IProps {
  clickedLink: string;
  setClickedLink: (message: string) => void;
}

function Sidebar({ clickedLink, setClickedLink }: IProps) {
  const userDataApi = useGetUserDataQuery({ person: "" });
  if (userDataApi.isLoading || !userDataApi.data) return null;
  
  return (
    <div className="sidebar__container">
      <SidebarLogo />
      <ul className="sidebar__links">
        <SidebarTabLists
          clickedLink={clickedLink}
          avatar={userDataApi?.data?.user.avatar_url}
          username={userDataApi?.data?.user.username}
          setClickedLink={setClickedLink}
        />
      </ul>
      <SidebarBurger />
    </div>
  );
}

export default Sidebar