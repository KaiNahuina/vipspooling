"use client";
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchProps {
  onSearch: (query: string) => void; // Callback to pass query to parent
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Pass query to parent on every change
  };

  return (
    <div className="flex items-center bg-gray-10 rounded-lg shadow-md p-2 w-full max-w-md">
      <FiSearch className="text-gray-500 ml-2" size={20} />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search forms..."
        className="flex-grow bg-transparent border-none outline-none px-3 py-2 text-gray-800"
      />
    </div>
  );
};

export default Search;