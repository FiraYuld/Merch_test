import ProductCard from './ProductCard';
import { products } from '../products';

function Catalog({ displayedProducts, cart, onOpenModal, onAddToCart, searchQuery }) {
  const getCartQty = (productId) => {
    const inCart = cart.filter(item => item.id === productId);
    return inCart.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (displayedProducts.length === 0) {
    const individualProduct = products.find(p => p.game === 'Индивидуально');

    return (
      <div className="catalog">
        <div className="empty-search">
          <div className="empty-search-icon">🔍</div>
          <p>Ничего не найдено</p>
          <span>Но вы можете заказать любой товар индивидуально!</span>
        </div>
        {individualProduct && (
          <div
            className="product-card individual-hint-card"
            onClick={() => onOpenModal(individualProduct)}
            style={{ animationDelay: '0s', cursor: 'pointer' }}
          >
            <div className="clickable-area">
              <div className="product-image">
                {individualProduct.img && typeof individualProduct.img === 'string' && individualProduct.img.length > 5 ? (
                  <img
                    src={individualProduct.img}
                    alt={individualProduct.name}
                    loading="lazy"
                    className="loading"
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
                  individualProduct.img
                )}
              </div>
              <div className="product-game">Индивидуально</div>
              <h3 className="product-name">{individualProduct.name}</h3>
            </div>
            <div className="card-bottom">
              <div className="card-bottom-row">
                <div className="product-price">{individualProduct.price} ₽</div>
                <button
                  className="buy-btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenModal(individualProduct);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="catalog">
      {displayedProducts.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          cartQty={getCartQty(product.id)}
          onOpenModal={onOpenModal}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

export default Catalog;
