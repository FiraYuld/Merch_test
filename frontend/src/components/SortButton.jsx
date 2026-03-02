function SortButton({ sortOrder, setSortOrder }) {
  const handleClick = () => {
    if (sortOrder === "default") setSortOrder("asc");
    else if (sortOrder === "asc") setSortOrder("desc");
    else setSortOrder("default");
  };

  return (
    <div className="sort-wrapper">
      <button className="sort-btn" onClick={handleClick}>
        {sortOrder === "default" && "⇅ Сортировка"}
        {sortOrder === "asc" && "▲ Сначала дешевые"}
        {sortOrder === "desc" && "▼ Сначала дорогие"}
      </button>
    </div>
  );
}

export default SortButton;
