import React, { useEffect } from "react";
import SearchBarUserList    from "./SearchBarUserList";

import {
  useDelUsersSearchMutation,
  useGetSearchesUserQuery,
  useGetUserDataQuery,
  useSaveUsersSearchMutation,
  useSearchUsersQuery,
} from "@/redux/api/userApi";

type SearchBarBodyProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

function SearchBarBody({
  search,
  setSearch,
}: SearchBarBodyProps) {
  const userApiData = useGetUserDataQuery({ person: "" });

  const searchesApiData = useSearchUsersQuery({ search }, { skip: !search });
  
  const [
    saveRecentSearch, 
    saveRecentSearchApi
  ] = useSaveUsersSearchMutation();
  
  const [
    deleteRecentSearch, 
    deleteRecentSearchApi
  ] = useDelUsersSearchMutation();

  const user = userApiData?.data?.user;
  const recentSearchesDataApi = useGetSearchesUserQuery(
    { user_id: user?.uuid },
    { skip: !user?.uuid }
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
