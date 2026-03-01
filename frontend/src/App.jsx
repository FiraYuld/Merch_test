import Fuse from 'fuse.js';
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
  // 🆕 Умная корзина: при запуске ищет сохраненные товары
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('sheepCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [activeCategory, setActiveCategory] = useState("Все"); 
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [toast, setToast] = useState(""); 

  const [sortOrder, setSortOrder] = useState("default");
  const [promoInput, setPromoInput] = useState(""); 
  const [appliedPromo, setAppliedPromo] = useState(null); 
  const [discountPercent, setDiscountPercent] = useState(0); 
  const [orderComment, setOrderComment] = useState(""); 

  // 🆕 Умные данные: запоминает ФИО и адрес
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem('sheepUser');
    return savedUser ? JSON.parse(savedUser) : { name: '', phone: '', city: '' };
  });

  const [showAgeModal, setShowAgeModal] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [removingItems, setRemovingItems] = useState([]);

  // 🆕 Эти эффекты автоматически сохраняют данные в память при любом их изменении
  useEffect(() => {
    localStorage.setItem('sheepCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sheepUser', JSON.stringify(userData));
  }, [userData]);

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
    
    // Если у опции есть своя картинка, берем её. Если нет - берем базовую от товара
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
    // Вибрация через Telegram
if (window.Telegram?.WebApp?.HapticFeedback) {
  window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
}

showToast(`✅ Добавлено: ${product.name} ${selectedOption ? `(${selectedOption.name})` : ''}`);


  // Пульсация кнопки
  const btn = document.querySelector(`[data-id="${product.id}"]`);
  if (btn) {
    btn.classList.remove('pulse');
    void btn.offsetWidth;
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 400);
  }
};

  const removeFromCart = (cartItemId) => {
  setCart((prevCart) => {
    const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
    if (existingItem.quantity === 1) {
      setRemovingItems(prev => [...prev, cartItemId]);
      setTimeout(() => {
        setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
        setRemovingItems(prev => prev.filter(id => id !== cartItemId));
      }, 300);
      return prevCart;
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowAgeModal(true);
    }
  } else {
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    const gameArray = Array.isArray(product.game) ? product.game : [product.game];

    // Если идёт поиск — показываем всё (18+ только если верифицирован)
    if (searchQuery.trim().length > 0) {
      if (gameArray.includes("18+") && !isAgeVerified) return false;
      return true;
    }

    // Обычная фильтрация по категории
    if (activeCategory === "Все") {
      return !gameArray.includes("18+");
    } else {
      return gameArray.includes(activeCategory);
    }
  });

  // Потом применяем умный поиск если есть запрос
  if (searchQuery.trim().length > 0) {
    const fuse = new Fuse(filtered, {
  keys: ["name", "game", "desc"],
  threshold: 0.35,
  minMatchCharLength: 3,
  ignoreLocation: true,
});
    filtered = fuse.search(searchQuery.trim()).map(result => result.item);
  }

  // Сортировка
  const sorted = [...filtered];

  // Поднимаем "Индивидуально" всегда наверх
const individual = sorted.filter(p => p.game === 'Индивидуально');
const rest = sorted.filter(p => p.game !== 'Индивидуально');

// Сортировка применяется только к остальным товарам, Индивидуально всегда первый
if (sortOrder === "asc") rest.sort((a, b) => a.price - b.price);
if (sortOrder === "desc") rest.sort((a, b) => b.price - a.price);

return [...individual, ...rest];
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
      items: formattedCart, 
      subtotal: subtotalPrice,
      discount: discountAmount,
      totalPrice: totalPrice, 
      promo: appliedPromo,
      comment: orderComment,
      user: userData 
    };

    // 🆕 Очищаем корзину из памяти браузера, так как заказ успешно оформлен
    localStorage.removeItem('sheepCart');

    if (window.Telegram?.WebApp?.sendData) {
      window.Telegram.WebApp.sendData(JSON.stringify(orderData));
    } else {
      alert(`Заказ оформлен!\nИтог: ${totalPrice} ₽`);
      // 🆕 Очищаем корзину локально для тестов в браузере
      setCart([]);
      setIsCartOpen(false);
    }
  };

  // Вычисляем текущую картинку для модалки: если выбрана опция с картинкой — показываем её
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
        <button className="cart-btn" onClick={() => {
  setIsCartOpen(!isCartOpen);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}}>
  {isCartOpen ? "Закрыть" : (
    <>🛒 Корзина (<span key={totalItems} className="cart-count">{totalItems}</span>)</>
  )}
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
    <div
  className="modal-content"
  onClick={(e) => e.stopPropagation()}
>
      <button className="close-modal" onClick={() => setSelectedProduct(null)}>×</button>
      <div className="modal-img">
        {currentModalImg && typeof currentModalImg === 'string' && currentModalImg.length > 5 ? (
          <img src={currentModalImg} alt={selectedProduct.name} />
        ) : (
          currentModalImg
        )}
      </div>
      <h2>{selectedProduct.name}</h2>
            
            {/* 🆕 Поддержка мультикатегорий в модалке */}
            <div className="modal-game">
                {Array.isArray(selectedProduct.game) ? selectedProduct.game.join(', ') : selectedProduct.game}
            </div>
            
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

              {/* Кнопка "О товаре" рендерится всегда */}
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
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
  <button className="back-to-catalog-btn" onClick={() => setIsCartOpen(false)}>
    ← Каталог
  </button>
  {cart.length > 0 && (
    <button className="clear-cart-btn" onClick={() => setShowClearConfirm(true)}>
  🗑 Очистить
</button>
  )}
  {showClearConfirm && (
  <div className="modal-overlay" onClick={() => setShowClearConfirm(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div style={{ fontSize: '48px', marginBottom: '10px' }}>🗑</div>
      <h2>Очистить корзину?</h2>
      <p style={{ color: '#8E8E93', fontSize: '14px', margin: '8px 0 24px' }}>
        Все товары будут удалены
      </p>
      <div className="modal-buttons-row">
        <button className="modal-info-btn" onClick={() => setShowClearConfirm(false)}>
          Отмена
        </button>
        <button className="modal-buy-btn" style={{ backgroundColor: '#ff4d4d' }} onClick={() => {
          setCart([]);
          localStorage.removeItem('sheepCart');
          setShowClearConfirm(false);
        }}>
          Очистить
        </button>
      </div>
    </div>
  </div>
)}
</div>
<h2 style={{ margin: '0 0 16px 0' }}>Оформление заказа</h2>

{cart.length === 0 ? (
            <p className="empty-cart">В корзине пока пусто...</p>
          ) : (
            <>
              <div className="cart-items-list">
                {cart.map((item) => (
<div key={item.cartItemId} className={`cart-item ${removingItems.includes(item.cartItemId) ? 'cart-item-removing' : ''}`}>                    <div className="cart-item-img">
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
<input
  type="text"
  placeholder="Промокод"
  value={promoInput}
  onChange={(e) => {
    setPromoInput(e.target.value);
    if (e.target.value.trim() === '') {
      setAppliedPromo(null);
      setDiscountPercent(0);
    }
  }}
/>                <button onClick={handleApplyPromo}>Применить</button>
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
  <div className="min-order-progress">
    <div className="min-order-progress-text">
      <span>До минимального заказа:</span>
      <span className="min-order-remain">{MIN_ORDER_AMOUNT - totalPrice} ₽</span>
    </div>
    <div className="min-order-progress-bar">
      <div
        className="min-order-progress-fill"
        style={{ width: `${Math.min((totalPrice / MIN_ORDER_AMOUNT) * 100, 100)}%` }}
      />
    </div>
  </div>
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
  {/* Строка поиска */}
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

  {/* Фильтры категорий — скрываем при активном поиске */}
{!searchQuery && (
  <div className="filters-row">
    <div className={`filters ${isCategoriesExpanded ? 'filters-expanded' : ''}`}>
      {categories.map(cat => (
        <button
  key={cat}
  className={`filter-btn ${activeCategory === cat ? 'active' : ''} ${cat === 'Индивидуально' ? 'filter-btn-individual' : ''} ${cat === '18+' ? 'filter-btn-18' : ''}`}
  onClick={() => handleCategoryClick(cat)}
>
  {cat}
</button>
      ))}
    </div>
    <button
      className="expand-categories-btn"
      onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
    >
      {isCategoriesExpanded ? '↑' : '↓'}
    </button>
  </div>
)}

  <div className="sort-wrapper">
  <button
    className="sort-btn"
    onClick={() => {
      if (sortOrder === "default") setSortOrder("asc");
      else if (sortOrder === "asc") setSortOrder("desc");
      else setSortOrder("default");
    }}
  >
    {sortOrder === "default" && "⇅ Сортировка"}
{sortOrder === "asc" && "▲ Сначала дешевые"}
{sortOrder === "desc" && "▼ Сначала дорогие"}
  </button>
</div>
</div>
{searchQuery && (
  <p className="search-results-count">
    Найдено: {displayedProducts.length} товаров
  </p>
)}
          <div className="catalog">
{displayedProducts.length === 0 ? (
  <>
    <div className="empty-search">
      <div className="empty-search-icon">🔍</div>
      <p>Ничего не найдено</p>
      <span>Но вы можете заказать любой товар индивидуально!</span>
    </div>
    {(() => {
      const individualProduct = products.find(p => p.game === 'Индивидуально');
      return individualProduct ? (
       <div
  className="product-card individual-hint-card"
  onClick={() => openModal(individualProduct)}
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
      <button className="buy-btn-small" onClick={(e) => { e.stopPropagation(); openModal(individualProduct); }}>+</button>
    </div>
  </div>
</div>
      ) : null;
    })()}
  </>
) : (
    displayedProducts.map((product) => (
<div key={product.id} className="product-card" style={{ animationDelay: `${displayedProducts.indexOf(product) * 0.08}s` }}>        <div className="clickable-area" onClick={() => openModal(product)}>
          <div className="product-image">
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
          {(() => {
            const inCart = cart.filter(item => item.id === product.id);
            const totalQty = inCart.reduce((sum, item) => sum + item.quantity, 0);
            return totalQty > 0 ? (
              <div className="in-cart-badge">✓ {totalQty} в корзине</div>
            ) : null;
          })()}

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
                    openModal(product);
                  } else {
                    addToCart(product);
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
    ))
  )}
</div>
        </>
      )}
    </div>
  );
}

export default App;