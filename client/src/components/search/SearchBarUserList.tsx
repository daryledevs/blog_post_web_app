import React                     from 'react'
import SearchBarUserCard         from './SearchBarUserCard';
import { MutationTrigger }       from '@reduxjs/toolkit/dist/query/react/buildHooks';
import SearchBarNoRecentSearches from './SearchBarNoRecentSearches';

type SearchBarUserListProps = {
  list: any;
  user: any;
  setSearch: any;
  setClickedLink: any;
  isRecentSearch: boolean;
  onClick: MutationTrigger<any>;
}

function SearchBarUserList({
  list,
  user,
  setSearch,
  setClickedLink,
  isRecentSearch,
  onClick,
}: SearchBarUserListProps) {
  return (
    <React.Fragment>
      {list?.length ? (
        list.map((searchUser: any, index: number) => (
          <SearchBarUserCard
            key={index}
            person={user}
            user={searchUser}
            isRecentSearch={isRecentSearch}
            setSearch={setSearch}
            setClickedLink={setClickedLink}
            onClick={onClick}
          />
        ))
      ) : (
        <SearchBarNoRecentSearches />
      )}
    </React.Fragment>
  );
}

export default SearchBarUserList
