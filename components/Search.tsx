import { FiSearch } from 'react-icons/fi';

const Search = () => {
  

  return (
    <div className="flex items-center bg-gray-10 rounded-lg shadow-md p-2 w-full max-w-md">
        <FiSearch className="text-gray-500 ml-2" size={20} />
        <input
          type="text"
          placeholder="Search"
          className="flex-grow bg-transparent border-none outline-none px-3 py-2 text-gray-800"
        />
        <button type="submit" className="sr-only">Search</button>
    </div>
  );
};

export default Search;


{/**
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const Search = () => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search query:', query);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="flex items-center bg-gray-100 rounded-lg shadow-md p-2 w-full max-w-md"
    >
      <FiSearch className="text-gray-500 ml-2" size={20} />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search forms..."
        className="flex-grow bg-transparent border-none outline-none px-3 py-2 text-gray-700"
      />
      <button type="submit" className="sr-only">Search</button>
    </form>
  );
};

export default Search;

*/}