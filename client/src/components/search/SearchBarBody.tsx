import React, { useEffect } from "react";
import SearchBarUserList from "./SearchBarUserList";

import {
  useDeleteRecentSearchUserMutation,
  useGetRecentSearchUserQuery,
  useGetUserDataQuery,
  useSaveRecentSearchUserMutation,
  useSearchUsersQuery,
} from "redux/api/userApi";

type SearchBarBodyProps = {
  search: string;
  setClickedLink: React.Dispatch<React.SetStateAction<any>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

function SearchBarBody({
  search,
  setClickedLink,
  setSearch,
}: SearchBarBodyProps) {
  const userApiData = useGetUserDataQuery({ person: "" });

  const searchesApiData = useSearchUsersQuery({ search }, { skip: !search });
  
  const [
    saveRecentSearch, 
    saveRecentSearchApi
  ] = useSaveRecentSearchUserMutation();
  
  const [
    deleteRecentSearch, 
    deleteRecentSearchApi
  ] = useDeleteRecentSearchUserMutation();

  const user = userApiData?.data?.user;
  const recentSearchesDataApi = useGetRecentSearchUserQuery(
    { user_id: user.user_id },
    { skip: !user.user_id }
  );

  const recentSearches = recentSearchesDataApi?.data?.users;

  const searchedUsers = searchesApiData?.data?.users;

  useEffect(() => {
    if (!search) recentSearchesDataApi.refetch();
  }, [saveRecentSearchApi, deleteRecentSearchApi]);

  if (
    searchesApiData.isLoading || 
    recentSearchesDataApi.isLoading
  ) return <></>;

  return (
    <div className="search-body__container">
      <div className="search-body__list">
        <SearchBarUserList
          list={search ? searchedUsers : recentSearches}
          user={user}
          isRecentSearch={!search}
          setSearch={setSearch}
          setClickedLink={setClickedLink}
          onClick={search ? 
            saveRecentSearch : 
            deleteRecentSearch
          }
        />
      </div>
    </div>
  );
}

export default SearchBarBody;
