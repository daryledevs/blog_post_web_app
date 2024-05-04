import avatar              from "@/assets/icons/avatar.png";
import CloseIcon           from "@/assets/icons/svg/close-icon-black.svg?react";
import { useNavigate }     from "react-router-dom";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";

type SearchBarUserCardProps = {
  user: any;
  person: any;
  isRecentSearch: boolean;
  onClick: MutationTrigger<any>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setClickedLink: React.Dispatch<React.SetStateAction<any>>;
};

function SearchBarUserCard({
  user,
  person,
  isRecentSearch,
  setClickedLink,
  setSearch,
  onClick,
}: SearchBarUserCardProps) {
  const navigate = useNavigate();

  const recentSearchesHandler = (
    person: any,
    user: any,
    isRecentSearch: boolean
  ) => {
    // If the user is not a recent search, save the search
    if (!isRecentSearch) {
      onClick({
        user_id: person.user_id,
        searched_id: user.user_id,
      });
    }

    // Reset the search and navigate to the user's profile
    setSearch("");
    setClickedLink({ previous: "", current: "Profile" });
    navigate(`/${user.username}`);
  };

  const deleteRecentSearchHandler = (event: any) => {
    if (isRecentSearch) {
      event.stopPropagation();
      onClick({ recent_id: user.recent_id });
    }
  };

  return (
    <div
      onClick={() => recentSearchesHandler(person, user, isRecentSearch)}
      className="search-card__container"
    >
      <img
        alt="avatar"
        src={user.avatar_url || avatar}
      />
      <div>
        <p>{user.username}</p>
        <p>
          {user.first_name} {user.last_name}
        </p>
      </div>
      {isRecentSearch ? (
        <CloseIcon onClick={deleteRecentSearchHandler} />
      ) : null}
    </div>
  );
}

export default SearchBarUserCard;
