import { useState, useEffect } from 'react';
import './App.css';
import { products, categories } from './products';
import { IMAGES } from './images';

const PROMO_CODES = {
  "СОННЫЙ": 0.02,
  "SHEEP": 0.05,
  "GUAZI": 0.10
};

const TERMS_LINK = "https://t.me/durov"; 
const MIN_ORDER_AMOUNT = 1500; 

function App() {
  const [cart, setCart] = useState([]); 
  const [activeCategory, setActiveCategory] = useState("Все"); 
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [toast, setToast] = useState(""); 

  // Сортировка и промо
  const [sortOrder, setSortOrder] = useState("default");
  const [promoInput, setPromoInput] = useState(""); 
  const [appliedPromo, setAppliedPromo] = useState(null); 
  const [discountPercent, setDiscountPercent] = useState(0); 
  const [orderComment, setOrderComment] = useState(""); 
  const [userData, setUserData] = useState({ name: '', phone: '', city: '' });

  // === НОВЫЕ СОСТОЯНИЯ ДЛЯ 18+ ===
  const [showAgeModal, setShowAgeModal] = useState(false); // Показ окна 18+
  const [isAgeVerified, setIsAgeVerified] = useState(false); // Подтвердил ли юзер возраст

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
    if (product.isAvailable === false) {
      showToast("❌ Товар временно недоступен");
      return;
    }
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

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setDiscountPercent(PROMO_CODES[code]);
      showToast(`🎉 Промокод ${code} применен!`);
    } else {
      showToast("❌ Неверный промокод");
      setAppliedPromo(null);
      setDiscountPercent(0);
    }
  };

  const openInfoLink = (link) => {
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(link);
    } else {
      window.open(link, '_blank');
    }
  };

  // === ЛОГИКА ПЕРЕКЛЮЧЕНИЯ КАТЕГОРИЙ (с проверкой 18+) ===
  const handleCategoryClick = (cat) => {
    if (cat === "18+") {
      if (isAgeVerified) {
        setActiveCategory(cat); // Уже подтверждал - пускаем
      } else {
        setShowAgeModal(true); // Не подтверждал - показываем окно
      }
    } else {
      setActiveCategory(cat); // Обычная категория
    }
  };

  // Подтверждение возраста
  const confirmAge = () => {
    setIsAgeVerified(true);
    setShowAgeModal(false);
    setActiveCategory("18+");
    showToast("🔞 Доступ открыт");
  };

  const denyAge = () => {
    setShowAgeModal(false);
    // Остаемся на текущей категории
  };

  // --- ЛОГИКА СОРТИРОВКИ И ФИЛЬТРАЦИИ ---
  const getSortedProducts = () => {
    let filtered;
    
    // ВАЖНО: Если категория "Все", мы исключаем товары 18+
    if (activeCategory === "Все") {
      filtered = products.filter(product => product.game !== "18+");
    } else {
      // Иначе показываем товары только выбранной категории
      filtered = products.filter(product => product.game === activeCategory);
    }

    const sorted = [...filtered]; 
    if (sortOrder === "asc") {
      return sorted.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      return sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  const displayedProducts = getSortedProducts();

  const subtotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.floor(subtotalPrice * discountPercent);
  const totalPrice = subtotalPrice - discountAmount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isMinOrderReached = totalPrice >= MIN_ORDER_AMOUNT;
  const isFormValid = userData.name.trim() && userData.phone.trim() && userData.city.trim() && cart.length > 0 && isMinOrderReached;

  const handleCheckout = () => {
    const orderData = { 
      items: cart, 
      subtotal: subtotalPrice,
      discount: discountAmount,
      totalPrice: totalPrice, 
      promo: appliedPromo,
      comment: orderComment,
      user: userData 
    };

    if (window.Telegram?.WebApp?.sendData) {
      window.Telegram.WebApp.sendData(JSON.stringify(orderData));
    } else {
      alert(`Заказ оформлен!\nИтог: ${totalPrice} ₽`);
    }
  };

  return (
    <div className="app-container">
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>

      <header className="header">
        <div className="logo-container">
            <img src={IMAGES.logo} alt="Logo" className="app-logo" />
            <h1>Sheep To Me</h1>
        </div>
        <button className="cart-btn" onClick={() => setIsCartOpen(!isCartOpen)}>
          {isCartOpen ? "Закрыть" : `🛒 Корзина (${totalItems})`}
        </button>
      </header>

      {/* === МОДАЛКА 18+ === */}
      {showAgeModal && (
        <div className="modal-overlay age-modal-overlay">
          <div className="modal-content age-modal-content">
            <div className="age-icon">🔞</div>
            <h2>Вам есть 18 лет?</h2>
            <p>Этот раздел содержит товары для взрослых. Пожалуйста, подтвердите ваш возраст.</p>
            <div className="modal-buttons-row">
              <button className="modal-info-btn deny-btn" onClick={denyAge}>Нет, назад</button>
              <button className="modal-buy-btn confirm-btn" onClick={confirmAge}>Да, мне 18+</button>
            </div>
          </div>
        </div>
      )}

      {/* Обычная модалка товара */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-img">
              {selectedProduct.img && typeof selectedProduct.img === 'string' && selectedProduct.img.length > 5 ? (
                <img src={selectedProduct.img} alt={selectedProduct.name} />
              ) : (
                selectedProduct.img
              )}
            </div>
            <h2>{selectedProduct.name}</h2>
            <div className="modal-game">{selectedProduct.game}</div>
            <p className="modal-desc">{selectedProduct.desc}</p>
            <div className="modal-price">{selectedProduct.price} ₽</div>
            
            <div className="modal-buttons-row">
              {selectedProduct.tgLink && (
                <button className="modal-info-btn" onClick={() => openInfoLink(selectedProduct.tgLink)}>
                  ℹ️ О товаре
                </button>
              )}
              <button 
                className={`modal-buy-btn ${selectedProduct.isAvailable === false ? 'disabled-btn' : ''}`} 
                onClick={() => { 
                    if(selectedProduct.isAvailable !== false) {
                        addToCart(selectedProduct); 
                        setSelectedProduct(null); 
                    }
                }}
                disabled={selectedProduct.isAvailable === false}
              >
                {selectedProduct.isAvailable === false ? "Нет в наличии" : "+ В корзину"}
              </button>
            </div>
          </div>
        </div>
      )}

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
                      {item.img && typeof item.img === 'string' && item.img.length > 5 ? <img src={item.img} alt={item.name} /> : item.img}
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

              <div className="promo-section">
                <input 
                  type="text" 
                  placeholder="Промокод" 
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                />
                <button onClick={handleApplyPromo}>Применить</button>
              </div>

              <div className="user-form">
                <h3>Данные получателя</h3>
                <input type="text" name="name" placeholder="ФИО" value={userData.name} onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Номер телефона" value={userData.phone} onChange={handleInputChange} />
                <input type="text" name="city" placeholder="Город доставки" value={userData.city} onChange={handleInputChange} />
                <textarea 
                  className="comment-input"
                  placeholder="Комментарий к заказу (необязательно)"
                  value={orderComment}
                  onChange={(e) => setOrderComment(e.target.value)}
                />
              </div>

              <div className="cart-summary">
                {appliedPromo && (
                  <div className="summary-row discount">
                    <span>Скидка ({appliedPromo}):</span>
                    <span>- {discountAmount} ₽</span>
                  </div>
                )}
                <h3>Итого: <span>{totalPrice} ₽</span></h3>
                {!isMinOrderReached && (
                  <div className="min-order-warning">
                    ⚠️ Минимальная сумма заказа: {MIN_ORDER_AMOUNT} ₽
                  </div>
                )}
                <button 
                  className={`checkout-btn ${!isFormValid ? 'disabled' : ''}`} 
                  onClick={handleCheckout}
                  disabled={!isFormValid}
                >
                  {isFormValid ? "🚀 Подтвердить заказ" : "Заполните все поля"}
                </button>
                <p className="terms-text">
                  Нажимая кнопку, вы соглашаетесь с <span onClick={() => openInfoLink(TERMS_LINK)}>условиями использования</span>
                </p>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="filters-container">
            <div className="filters">
                {categories.map(cat => (
                <button 
                    key={cat} 
                    /* Здесь мы используем handleCategoryClick вместо setActiveCategory
                       чтобы перехватить нажатие на 18+ 
                    */
                    className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} 
                    onClick={() => handleCategoryClick(cat)} 
                >
                    {cat}
                </button>
                ))}
            </div>
            
            <div className="sort-wrapper">
                <select 
                    className="sort-select" 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="default">Сортировка</option>
                    <option value="asc">Сначала дешевые</option>
                    <option value="desc">Сначала дорогие</option>
                </select>
            </div>
          </div>

          <div className="catalog">
            {displayedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="clickable-area" onClick={() => setSelectedProduct(product)}>
                  <div className="product-image">
                    {product.img && typeof product.img === 'string' && product.img.length > 5 ? (
                        <img src={product.img} alt={product.name} /> 
                    ) : (
                        product.img
                    )}
                  </div>
                  <div className="product-game">{product.game}</div>
                  <h3 className="product-name">{product.name}</h3>
                </div>
                
                <div className="card-bottom">
                  <div className="product-price">{product.price} ₽</div>
                  <button 
                    className={`buy-btn-small ${product.isAvailable === false ? 'disabled-small' : ''}`} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if(product.isAvailable !== false) addToCart(product);
                    }}
                    disabled={product.isAvailable === false}
                  >
                    {product.isAvailable === false ? "🚫" : "+"}
                  </button>
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