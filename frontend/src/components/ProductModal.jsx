function ProductModal({ 
  product, 
  currentImg, 
  selectedOptionIndex, 
  setSelectedOptionIndex, 
  onClose, 
  onAddToCart, 
  onOpenInfo 
}) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        <div className="modal-scroll">
          <div className="modal-img">
            {currentImg && typeof currentImg === 'string' && currentImg.length > 5 ? (
              <img src={currentImg} alt={product.name} />
            ) : (
              currentImg
            )}
          </div>
          <h2>{product.name}</h2>

          <div className="modal-game">
            {Array.isArray(product.game) ? product.game.join(', ') : product.game}
          </div>

          <p className="modal-desc">{product.desc}</p>

          <div className="modal-price">
            {product.options && product.options.length > 0
              ? `${product.options[selectedOptionIndex].price} ₽`
              : `${product.price} ₽`}
          </div>
        </div>

        <div className="modal-buttons-row">
          {product.options && product.options.length > 0 && (
            <select
              className="modal-option-select"
              value={selectedOptionIndex}
              onChange={(e) => setSelectedOptionIndex(Number(e.target.value))}
            >
              {product.options.map((opt, idx) => (
                <option key={idx} value={idx}>{opt.name}</option>
              ))}
            </select>
          )}

          <button className="modal-info-btn" onClick={() => onOpenInfo(product.tgLink)}>
            ℹ️ О товаре
          </button>

          <button
            className={`modal-buy-btn ${product.isAvailable === false ? 'disabled-btn' : ''}`}
            data-testid="add-to-cart-modal"
            onClick={(e) => {
              if (product.isAvailable !== false) {
                const opt = product.options ? product.options[selectedOptionIndex] : null;
                const imgEl = e.target.closest('.modal-content')?.querySelector('.modal-img');
                onAddToCart(product, opt, imgEl);
                onClose();
              }
            }}
            disabled={product.isAvailable === false}
          >
            {product.isAvailable === false ? "Нет в наличии" : "+ В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
