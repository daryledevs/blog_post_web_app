import React from 'react'
import Input from './Elements/Input'

type SearchBarHeaderProps = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

function SearchBarHeader({ setSearch }: SearchBarHeaderProps) {
  return (
    <div className='search-header__container'>
      <h3>Search</h3>
      <Input 
        type='text'
        placeholder='Search'
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchBarHeader
