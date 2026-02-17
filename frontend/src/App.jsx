import { useState, useEffect } from 'react';
import './App.css';
import { products, categories } from './products';

function App() {
  const [cart, setCart] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("Все"); 
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [toast, setToast] = useState(""); 

  const [userData, setUserData] = useState({ name: '', phone: '', city: '' });

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showToast(`✅ Добавлено: ${product.name}`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem.quantity === 1) {
        return prevCart.filter(item => item.id !== productId);
      } else {
        return prevCart.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item 
        );
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Функция для открытия ссылки в ТГ
  const openInfoLink = (link) => {
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(link); // Нативно в ТГ
    } else {
      window.open(link, '_blank'); // Если открыто в браузере
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isFormValid = userData.name.trim() && userData.phone.trim() && userData.city.trim() && cart.length > 0;

  const handleCheckout = () => {
    const orderData = { items: cart, totalPrice, user: userData };
    if (window.Telegram?.WebApp?.sendData) {
      window.Telegram.WebApp.sendData(JSON.stringify(orderData));
    } else {
      alert(`Заказ оформлен!\nИмя: ${userData.name}\nИтого: ${totalPrice} ₽`);
    }
  };

  const filteredProducts = activeCategory === "Все" 
    ? products 
    : products.filter(product => product.game === activeCategory);

  return (
    <div className="app-container">
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>

      <header className="header">
        <h1>🐑 Sheep 2 Me</h1>
        <button className="cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? "Закрыть" : `🛒 Корзина (${totalItems})`}
        </button>
      </header>

      {/* Модальное окно */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-img">
              {selectedProduct.img && selectedProduct.img.length > 2 ? (
                <img src={selectedProduct.img} alt={selectedProduct.name} />
              ) : (
                selectedProduct.img
              )}
            </div>
            <h2>{selectedProduct.name}</h2>
            <div className="modal-game">{selectedProduct.game}</div>
            <p className="modal-desc">{selectedProduct.desc}</p>
            <div className="modal-price">{selectedProduct.price} ₽</div>
            
            {/* Ряд с кнопками */}
            <div className="modal-buttons-row">
              {selectedProduct.tgLink && (
                <button 
                  className="modal-info-btn" 
                  onClick={() => openInfoLink(selectedProduct.tgLink)}
                >
                  ℹ️ О товаре
                </button>
              )}
              <button className="modal-buy-btn" onClick={() => { 
                addToCart(selectedProduct); 
                setSelectedProduct(null); 
              }}>
                + В корзину
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Корзина и Каталог */}
      {isCartOpen ? (
        <div className="cart-view">
          <h2>Оформление заказа</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">В корзине пока пусто...</p>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-img">
                      {item.img && item.img.length > 2 ? <img src={item.img} alt={item.name} /> : item.img}
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => removeFromCart(item.id)}>−</button>
                        <span className="qty-text">{item.quantity} шт.</span>
                        <button className="qty-btn" onClick={() => addToCart(item)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-total">{item.price * item.quantity} ₽</div>
                  </div>
                ))}
              </div>

              <div className="user-form">
                <h3>Данные получателя</h3>
                <input type="text" name="name" placeholder="ФИО" value={userData.name} onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Номер телефона" value={userData.phone} onChange={handleInputChange} />
                <input type="text" name="city" placeholder="Город доставки" value={userData.city} onChange={handleInputChange} />
              </div>

              <div className="cart-summary">
                <h3>Итого: <span>{totalPrice} ₽</span></h3>
                <button 
                  className={`checkout-btn ${!isFormValid ? 'disabled' : ''}`} 
                  onClick={handleCheckout}
                  disabled={!isFormValid}
                >
                  {isFormValid ? "🚀 Подтвердить заказ" : "Заполните все поля"}
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="filters">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} 
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="catalog">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="clickable-area" onClick={() => setSelectedProduct(product)}>
                  <div className="product-image">
                    {product.img && product.img.length > 2 ? <img src={product.img} alt={product.name} /> : product.img}
                  </div>
                  <div className="product-game">{product.game}</div>
                  <h3 className="product-name">{product.name}</h3>
                </div>
                
                <div className="card-bottom">
                  <div className="product-price">{product.price} ₽</div>
                  <button className="buy-btn-small" onClick={() => addToCart(product)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;