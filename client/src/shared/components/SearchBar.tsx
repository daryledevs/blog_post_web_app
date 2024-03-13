import { ClickedLink } from 'pages/Index';
import SearchBarHeader from './SearchBarHeader';
import SearchBarBody from './SearchBarBody';
import { useState } from 'react';

type SearchBarProps = {
  clickedLink: ClickedLink;
  setClickedLink: React.Dispatch<React.SetStateAction<ClickedLink>>;
}

function SearchBar({ clickedLink, setClickedLink }: SearchBarProps) {
  const [search, setSearch] = useState<string>("");
  if (clickedLink.current !== "Search") return null;
  return (
    <div className="search-bar__container">
      <SearchBarHeader setSearch={setSearch} />
      <SearchBarBody
        search={search}
        setSearch={setSearch}
        setClickedLink={setClickedLink}
      />
    </div>
  );
}

export default SearchBar;

