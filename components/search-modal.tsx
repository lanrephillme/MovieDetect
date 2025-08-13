"use client"

import { useState } from "react"
import { SearchPlaceholder } from "./search-placeholder"

const SearchModal = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("text");
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Show placeholder instead of making API calls
    setShowPlaceholder(true);
  };

  // Show placeholder when search is triggered
  if (showPlaceholder) {
    return (
      <SearchPlaceholder
        searchQuery={query}
        searchType={searchType}
        onClose={() => {
          setShowPlaceholder(false);
          setIsOpen(false);
          setQuery("");
        }}
      />
    );
  }

  return (
    <div>
      {/* Search Modal Content */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>\
      {/* /** rest of code here **/ */}
 {4}</div>
  );
};

export default SearchModal;\
