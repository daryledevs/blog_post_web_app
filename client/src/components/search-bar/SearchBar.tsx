import { useState }      from 'react';
import { useSelector }   from 'react-redux';
import { selectSidebar } from '@/redux/slices/sidebarSlice';

import SearchBarBody     from './SearchBarBody';
import SearchBarHeader   from './SearchBarHeader';

function SearchBar() {
  const sidebarState = useSelector(selectSidebar);
  const [search, setSearch] = useState<string>("");

  if (sidebarState.current !== "Search") return null;
  return (
    <div className="search-bar__container">
      <SearchBarHeader setSearch={setSearch} />
      <SearchBarBody
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}

export default SearchBar;

