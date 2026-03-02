function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="search-wrapper">
      <input
        type="search"
        className="search-input"
        placeholder="🔍 Поиск товара..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      {searchQuery && (
        <button className="search-clear-btn" onClick={() => setSearchQuery("")}>×</button>
      )}
    </div>
  );
}

export default SearchBar;
