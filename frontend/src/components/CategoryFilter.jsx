function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryClick, 
  isExpanded, 
  setIsExpanded 
}) {
  return (
    <div className="filters-row">
      <div className={`filters ${isExpanded ? 'filters-expanded' : ''}`}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''} ${cat === 'Индивидуально' ? 'filter-btn-individual' : ''} ${cat === '18+' ? 'filter-btn-18' : ''}`}
            onClick={() => onCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <button
        className="expand-categories-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '↑' : '↓'}
      </button>
    </div>
  );
}

export default CategoryFilter;
