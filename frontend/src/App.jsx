import { useState, useEffect } from 'react';
import './App.css';
import { products, categories } from './products';

function App() {
  // === СОСТОЯНИЯ (STATE) ===
  const [cart, setCart] = useState([]); // Корзина товаров
  const [activeCategory, setActiveCategory] = useState("Все"); // Текущий фильтр
  const [isCartOpen, setIsCartOpen] = useState(false); // Открыта ли корзина
  const [selectedProduct, setSelectedProduct] = useState(null); // Товар для модалки
  const [toast, setToast] = useState(""); // Текст уведомления

  const [userData, setUserData] = useState({
    name: '', phone: '', city: ''
  });

  // === ЭФФЕКТЫ ===
  // Раскрываем Web App на весь экран при запуске
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  // === ЛОГИКА ===
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Если товар уже есть, увеличиваем количество
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Если нет — добавляем как новый
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    showToast(`✅ Добавлено: ${product.name}`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem.quantity === 1) {
        return prevCart.filter(item => item.id !== productId); // Удаляем совсем
      } else {
        return prevCart.map(item => 
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item // Уменьшаем кол-во
        );
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Вычисляемые значения для корзины
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isFormValid = userData.name.trim() && userData.phone.trim() && userData.city.trim() && cart.length > 0;

  // Отправка данных в Телеграм
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

  // === РЕНДЕР (ИНТЕРФЕЙС) ===
  return (
    <div className="app-container">
      {/* Всплывающее уведомление */}
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>

      {/* Шапка */}
      <header className="header">
        <h1>🐑 Guazi Shop</h1>
        <button className="cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? "❌ Назад" : `🛒 Корзина (${totalItems})`}
        </button>
      </header>

      {/* Модальное окно товара */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>✖</button>
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
            <button className="modal-buy-btn" onClick={() => { 
              addToCart(selectedProduct); 
              setSelectedProduct(null); 
            }}>
              ➕ В корзину
            </button>
          </div>
        </div>
      )}

      {/* Основной контент: Корзина ИЛИ Каталог */}
      {isCartOpen ? (
        <div className="cart-view">
          <h2>Оформление заказа</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">В корзине пока пусто...</p>
          ) : (
            <>
              {/* Список товаров в корзине */}
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-img">
                      {item.img && item.img.length > 2 ? <img src={item.img} alt={item.name} /> : item.img}
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => removeFromCart(item.id)}>➖</button>
                        <span className="qty-text">{item.quantity} шт.</span>
                        <button className="qty-btn" onClick={() => addToCart(item)}>➕</button>
                      </div>
                    </div>
                    <div className="cart-item-total">{item.price * item.quantity} ₽</div>
                  </div>
                ))}
              </div>

              {/* Форма доставки */}
              <div className="user-form">
                <h3>Данные получателя</h3>
                <input type="text" name="name" placeholder="ФИО" value={userData.name} onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Номер телефона" value={userData.phone} onChange={handleInputChange} />
                <input type="text" name="city" placeholder="Город доставки" value={userData.city} onChange={handleInputChange} />
              </div>

              {/* Итоги */}
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
          {/* Фильтры */}
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

          {/* Каталог */}
          <div className="catalog">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {/* Кликабельная зона для модалки. flex-grow заставит её растянуться */}
                <div className="clickable-area" onClick={() => setSelectedProduct(product)}>
                  <div className="product-image">
                    {product.img && product.img.length > 2 ? <img src={product.img} alt={product.name} /> : product.img}
                  </div>
                  <div className="product-game">{product.game}</div>
                  <h3 className="product-name">{product.name}</h3>
                </div>
                
                {/* Зона покупки, которая всегда прижата к низу */}
                <div className="card-bottom">
                  <div className="product-price">{product.price} ₽</div>
                  <button className="buy-btn-small" onClick={() => addToCart(product)}>➕</button>
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