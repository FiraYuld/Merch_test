function ProductCard({ product, index, cartQty, onOpenModal, onAddToCart }) {
  return (
    <div
      className="product-card"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="clickable-area" onClick={() => onOpenModal(product)}>
        <div className="product-image">
          {product.badge && <span className="product-badge">{product.badge}</span>}
          {product.preorder && <span className="product-badge product-badge-preorder">Предзаказ</span>}
          {product.img && typeof product.img === 'string' && product.img.length > 5 ? (
            <img
              src={product.img}
              alt={product.name}
              className="loading"
              loading="lazy"
              onLoad={(e) => {
                e.target.classList.remove('loading');
                e.target.classList.add('loaded');
              }}
              onError={(e) => {
                e.target.classList.remove('loading');
                e.target.classList.add('img-error');
              }}
            />
          ) : (
            product.img
          )}
        </div>

        <div className="product-game">
          {Array.isArray(product.game) ? product.game.join(', ') : product.game}
        </div>

        <h3 className="product-name">{product.name}</h3>
      </div>

      <div className="card-bottom">
        {cartQty > 0 && (
          <div className="in-cart-badge">✓ {cartQty} в корзине</div>
        )}

        <div className="card-bottom-row">
          <div className="product-price">
            {product.options && product.options.length > 0
              ? `от ${Math.min(...product.options.map(o => o.price))} ₽`
              : `${product.price} ₽`}
          </div>
          <button
            className={`buy-btn-small ${product.isAvailable === false ? 'disabled-small' : ''}`}
            data-id={product.id}
            onClick={(e) => {
              e.stopPropagation();
              if (product.isAvailable !== false) {
                if (product.options && product.options.length > 0) {
                  onOpenModal(product);
                } else {
                  const imgEl = e.target.closest('.product-card')?.querySelector('.product-image');
                  onAddToCart(product, null, imgEl);
                }
              }
            }}
            disabled={product.isAvailable === false}
          >
            {product.isAvailable === false ? "🚫" : (product.options && product.options.length > 0 ? "☰" : "+")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
