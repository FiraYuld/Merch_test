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

  const [sortOrder, setSortOrder] = useState("default");
  const [promoInput, setPromoInput] = useState(""); 
  const [appliedPromo, setAppliedPromo] = useState(null); 
  const [discountPercent, setDiscountPercent] = useState(0); 
  const [orderComment, setOrderComment] = useState(""); 
  const [userData, setUserData] = useState({ name: '', phone: '', city: '' });

  const [showAgeModal, setShowAgeModal] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedOptionIndex(0);
  };

  const addToCart = (product, selectedOption = null) => {
    if (product.isAvailable === false) {
      showToast("❌ Товар временно недоступен");
      return;
    }

    const cartItemId = selectedOption ? `${product.id}-${selectedOption.name}` : String(product.id);
    const itemPrice = selectedOption ? selectedOption.price : product.price;
    
    // 🆕 Если у опции есть своя картинка, берем её. Если нет - берем базовую от товара
    const itemImg = (selectedOption && selectedOption.img) ? selectedOption.img : product.img;

    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Перезаписываем img для корзины на itemImg
        return [...prevCart, { ...product, cartItemId, price: itemPrice, img: itemImg, selectedOption, quantity: 1 }];
      }
    });
    
    showToast(`✅ Добавлено: ${product.name} ${selectedOption ? `(${selectedOption.name})` : ''}`);
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem.quantity === 1) {
        return prevCart.filter(item => item.cartItemId !== cartItemId);
      } else {
        return prevCart.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item 
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

  const handleCategoryClick = (cat) => {
    if (cat === "18+") {
      if (isAgeVerified) {
        setActiveCategory(cat);
      } else {
        setShowAgeModal(true);
      }
    } else {
      setActiveCategory(cat);
    }
  };

  const confirmAge = () => {
    setIsAgeVerified(true);
    setShowAgeModal(false);
    setActiveCategory("18+");
    showToast("🔞 Доступ открыт");
  };

  const denyAge = () => {
    setShowAgeModal(false);
  };

const getSortedProducts = () => {
    let filtered = products.filter(product => {
      // Превращаем одиночную категорию в массив, чтобы логика была единой
      const gameArray = Array.isArray(product.game) ? product.game : [product.game];
      
      if (activeCategory === "Все") {
        return !gameArray.includes("18+"); // Скрываем 18+ из "Все"
      } else {
        return gameArray.includes(activeCategory); // Ищем совпадение
      }
    });

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
    // 🆕 Перед отправкой пробегаемся по корзине и приклеиваем опцию к имени
    const formattedCart = cart.map(item => ({
        ...item,
        name: item.selectedOption ? `${item.name} (${item.selectedOption.name})` : item.name
    }));

    const orderData = { 
      items: formattedCart, // ⬅️ Отправляем обновленный список с опциями!
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

  // 🆕 Вычисляем текущую картинку для модалки: если выбрана опция с картинкой — показываем её
  const currentModalImg = selectedProduct && selectedProduct.options && selectedProduct.options[selectedOptionIndex]?.img
      ? selectedProduct.options[selectedOptionIndex].img
      : selectedProduct?.img;

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

      {/* Окно 18+ */}
      {showAgeModal && (
        <div className="modal-overlay age-modal-overlay">
          <div className="modal-content age-modal-content">
            <div className="age-icon">🔞</div>
            <h2>Вам есть 18 лет?</h2>
            <p>Этот раздел содержит товары для взрослых. Пожалуйста, подтвердите ваш возраст.</p>
            <div className="modal-buttons-row">
              <button className="modal-info-btn deny-btn" onClick={denyAge}>Нет</button>
              <button className="modal-buy-btn confirm-btn" onClick={confirmAge}>Да, мне 18+</button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно товара */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="modal-img">
              {/* 🆕 Используем динамическую картинку currentModalImg */}
              {currentModalImg && typeof currentModalImg === 'string' && currentModalImg.length > 5 ? (
                <img src={currentModalImg} alt={selectedProduct.name} />
              ) : (
                currentModalImg
              )}
            </div>
            <h2>{selectedProduct.name}</h2>
            <div className="modal-game">{Array.isArray(selectedProduct.game) ? selectedProduct.game.join(', ') : selectedProduct.game}</div>
            <p className="modal-desc">{selectedProduct.desc}</p>
            
            <div className="modal-price">
                {selectedProduct.options && selectedProduct.options.length > 0
                    ? `${selectedProduct.options[selectedOptionIndex].price} ₽`
                    : `${selectedProduct.price} ₽`}
            </div>
            
            <div className="modal-buttons-row">
              {selectedProduct.options && selectedProduct.options.length > 0 && (
                <select
                  className="modal-option-select"
                  value={selectedOptionIndex}
                  onChange={(e) => setSelectedOptionIndex(Number(e.target.value))}
                >
                  {selectedProduct.options.map((opt, idx) => (
                    <option key={idx} value={idx}>{opt.name}</option>
                  ))}
                </select>
              )}

              {/* 🆕 Кнопка "О товаре" теперь рендерится всегда (мы добавили tgLink всем) */}
              <button className="modal-info-btn" onClick={() => openInfoLink(selectedProduct.tgLink)}>
                ℹ️ О товаре
              </button>

              <button 
                className={`modal-buy-btn ${selectedProduct.isAvailable === false ? 'disabled-btn' : ''}`} 
                onClick={() => { 
                    if(selectedProduct.isAvailable !== false) {
                        const opt = selectedProduct.options ? selectedProduct.options[selectedOptionIndex] : null;
                        addToCart(selectedProduct, opt); 
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

      {/* Корзина */}
      {isCartOpen ? (
        <div className="cart-view">
          <h2>Оформление заказа</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">В корзине пока пусто...</p>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <div className="cart-item-img">
                      {/* Картинка будет соответствовать выбранной опции */}
                      {item.img && typeof item.img === 'string' && item.img.length > 5 ? <img src={item.img} alt={item.name} /> : item.img}
                    </div>
                    <div className="cart-item-info">
                      <h4>
                        {item.name}
                        {item.selectedOption && (
                            <span className="cart-item-option"><br/>({item.selectedOption.name})</span>
                        )}
                      </h4>
                      <div className="quantity-controls">
                        <button className="qty-btn" onClick={() => removeFromCart(item.cartItemId)}>−</button>
                        <span className="qty-text">{item.quantity} шт.</span>
                        <button className="qty-btn" onClick={() => addToCart(item, item.selectedOption)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-total">{item.price * item.quantity} ₽</div>
                  </div>
                ))}
              </div>

              <div className="promo-section">
                <input type="text" placeholder="Промокод" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} />
                <button onClick={handleApplyPromo}>Применить</button>
              </div>

              <div className="user-form">
                <h3>Данные получателя</h3>
                <input type="text" name="name" placeholder="ФИО" value={userData.name} onChange={handleInputChange} />
                <input type="tel" name="phone" placeholder="Номер телефона" value={userData.phone} onChange={handleInputChange} />
                <input type="text" name="city" placeholder="Город доставки" value={userData.city} onChange={handleInputChange} />
                <textarea className="comment-input" placeholder="Комментарий к заказу" value={orderComment} onChange={(e) => setOrderComment(e.target.value)} />
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
                  <div className="min-order-warning">⚠️ Минимальная сумма заказа: {MIN_ORDER_AMOUNT} ₽</div>
                )}
                <button className={`checkout-btn ${!isFormValid ? 'disabled' : ''}`} onClick={handleCheckout} disabled={!isFormValid}>
                  {isFormValid ? "🚀 Подтвердить заказ" : "Заполните все поля"}
                </button>
                <p className="terms-text">Нажимая кнопку, вы соглашаетесь с <span onClick={() => openInfoLink(TERMS_LINK)}>условиями использования</span></p>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="filters-container">
            <div className="filters">
                {categories.map(cat => (
                <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}>
                    {cat}
                </button>
                ))}
            </div>
            <div className="sort-wrapper">
                <select className="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="default">Сортировка</option>
                    <option value="asc">Сначала дешевые</option>
                    <option value="desc">Сначала дорогие</option>
                </select>
            </div>
          </div>

          <div className="catalog">
            {displayedProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="clickable-area" onClick={() => openModal(product)}>
                  <div className="product-image">
                    {product.img && typeof product.img === 'string' && product.img.length > 5 ? (
                        <img src={product.img} alt={product.name} /> 
                    ) : (
                        product.img
                    )}
                  </div>
                  <div className="product-game">{Array.isArray(product.game) ? product.game.join(', ') : product.game}</div>
                  <h3 className="product-name">{product.name}</h3>
                </div>
                
                <div className="card-bottom">
                  <div className="product-price">
                    {product.options && product.options.length > 0
                        ? `от ${Math.min(...product.options.map(o => o.price))} ₽`
                        : `${product.price} ₽`}
                  </div>
                  <button 
                    className={`buy-btn-small ${product.isAvailable === false ? 'disabled-small' : ''}`} 
                    onClick={(e) => {
                        e.stopPropagation();
                        if(product.isAvailable !== false) {
                            if (product.options && product.options.length > 0) {
                                openModal(product);
                            } else {
                                addToCart(product);
                            }
                        }
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