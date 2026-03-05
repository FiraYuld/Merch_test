import Fuse from 'fuse.js';
import { useState, useEffect, useMemo, useRef } from 'react';
import './App.css';
import { products, categories } from './products';

import {
  Header,
  Toast,
  FlyingItem,
  AgeModal,
  ProductModal,
  SearchBar,
  CategoryFilter,
  SortButton,
  CartView,
  Catalog,
  OrderHistoryModal,
  ScrollTopButton
} from './components';

const PROMO_CODES = {
  "СОННЫЙ": 0.02,
};

const TERMS_LINK = "https://t.me/sheep2me/4";
const MIN_ORDER_AMOUNT = 1500;

function App() {
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [flyingItem, setFlyingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cartBtnRef = useRef(null);

  const [orderHistory, setOrderHistory] = useState(() => {
    const savedHistory = localStorage.getItem('sheepOrderHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  // Effects
  useEffect(() => {
    localStorage.setItem('sheepCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sheepUser', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('sheepOrderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.expand();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedOptionIndex(0);
  };

  const animateFlyToCart = (imgSrc, startElement) => {
    if (!cartBtnRef.current || !startElement) return;
    
    const startRect = startElement.getBoundingClientRect();
    const endRect = cartBtnRef.current.getBoundingClientRect();
    
    setFlyingItem({
      img: imgSrc,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: endRect.left + endRect.width / 2,
      endY: endRect.top + endRect.height / 2,
    });
    
    setTimeout(() => setFlyingItem(null), 600);
  };

  const addToCart = (product, selectedOption = null, sourceElement = null) => {
    if (product.isAvailable === false) {
      showToast("❌ Товар временно недоступен");
      return;
    }

    const cartItemId = selectedOption ? `${product.id}-${selectedOption.name}` : String(product.id);
    const itemPrice = selectedOption ? selectedOption.price : product.price;
    const itemImg = (selectedOption && selectedOption.img) ? selectedOption.img : product.img;

    if (sourceElement && typeof itemImg === 'string') {
      animateFlyToCart(itemImg, sourceElement);
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevCart.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, cartItemId, price: itemPrice, img: itemImg, selectedOption, quantity: 1 }];
      }
    });

    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    // Яндекс.Метрика — цель "Добавление в корзину"
    if (window.ym) {
      window.ym(107070634, 'reachGoal', 'addToCart', { productId: product.id, productName: product.name, price: itemPrice });
    }

    showToast(`✅ Добавлено: ${product.name} ${selectedOption ? `(${selectedOption.name})` : ''}`);

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
    
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 20);
      setUserData(prev => ({ ...prev, phone: digitsOnly }));
    } else {
      setUserData(prev => ({ ...prev, [name]: value }));
    }
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

  // Computed values
  const displayedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const gameArray = Array.isArray(product.game) ? product.game : [product.game];

      if (searchQuery.trim().length > 0) {
        if (gameArray.includes("18+") && !isAgeVerified) return false;
        return true;
      }

      if (activeCategory === "Все") {
        return !gameArray.includes("18+");
      } else {
        return gameArray.includes(activeCategory);
      }
    });

    if (searchQuery.trim().length > 0) {
      const fuse = new Fuse(filtered, {
        keys: ["name", "game", "desc"],
        threshold: 0.35,
        minMatchCharLength: 3,
        ignoreLocation: true,
      });
      filtered = fuse.search(searchQuery.trim()).map(result => result.item);
    }

    const sorted = [...filtered];
    const individual = sorted.filter(p => p.game === 'Индивидуально');
    const rest = sorted.filter(p => p.game !== 'Индивидуально');

    if (sortOrder === "asc") rest.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") rest.sort((a, b) => b.price - a.price);

    return [...individual, ...rest];
  }, [searchQuery, activeCategory, sortOrder, isAgeVerified]);

  const subtotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = Math.floor(subtotalPrice * discountPercent);
  const totalPrice = subtotalPrice - discountAmount;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isMinOrderReached = totalPrice >= MIN_ORDER_AMOUNT;
  const isFormValid = userData.name.trim() && userData.phone.trim() && userData.city.trim() && cart.length > 0 && isMinOrderReached;

  const handleCheckout = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

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

    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: cart.map(item => ({
        name: item.name,
        optionName: item.selectedOption?.name || null,
        quantity: item.quantity,
        price: item.price
      })),
      total: totalPrice
    };
    setOrderHistory(prev => [historyEntry, ...prev]);

    localStorage.removeItem('sheepCart');

    // Яндекс.Метрика — цель "Оформление заказа"
    if (window.ym) {
      window.ym(107070634, 'reachGoal', 'checkout', { totalPrice: totalPrice, itemsCount: cart.length });
    }

    if (window.Telegram?.WebApp?.sendData) {
      window.Telegram.WebApp.sendData(JSON.stringify(orderData));
    } else {
      alert(`Заказ оформлен!\nИтог: ${totalPrice} ₽`);
      setCart([]);
      setIsCartOpen(false);
      setIsSubmitting(false);
    }
  };

  const currentModalImg = selectedProduct && selectedProduct.options && selectedProduct.options[selectedOptionIndex]?.img
    ? selectedProduct.options[selectedOptionIndex].img
    : selectedProduct?.img;

  return (
    <div className="app-container">
      <Toast message={toast} />
      <FlyingItem flyingItem={flyingItem} />

      <Header
        totalItems={totalItems}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartBtnRef={cartBtnRef}
      />

      {showAgeModal && (
        <AgeModal onConfirm={confirmAge} onDeny={denyAge} />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          currentImg={currentModalImg}
          selectedOptionIndex={selectedOptionIndex}
          setSelectedOptionIndex={setSelectedOptionIndex}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onOpenInfo={openInfoLink}
        />
      )}

      {isCartOpen ? (
        <CartView
          cart={cart}
          setCart={setCart}
          removingItems={removingItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          promoInput={promoInput}
          setPromoInput={setPromoInput}
          appliedPromo={appliedPromo}
          setAppliedPromo={setAppliedPromo}
          discountPercent={discountPercent}
          setDiscountPercent={setDiscountPercent}
          handleApplyPromo={handleApplyPromo}
          userData={userData}
          handleInputChange={handleInputChange}
          orderComment={orderComment}
          setOrderComment={setOrderComment}
          subtotalPrice={subtotalPrice}
          discountAmount={discountAmount}
          totalPrice={totalPrice}
          isMinOrderReached={isMinOrderReached}
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          handleCheckout={handleCheckout}
          openInfoLink={openInfoLink}
          setIsCartOpen={setIsCartOpen}
          showClearConfirm={showClearConfirm}
          setShowClearConfirm={setShowClearConfirm}
          orderHistory={orderHistory}
          setShowOrderHistory={setShowOrderHistory}
          MIN_ORDER_AMOUNT={MIN_ORDER_AMOUNT}
          TERMS_LINK={TERMS_LINK}
        />
      ) : (
        <>
          <div className="filters-container">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            {!searchQuery && (
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryClick={handleCategoryClick}
                isExpanded={isCategoriesExpanded}
                setIsExpanded={setIsCategoriesExpanded}
              />
            )}

            <SortButton sortOrder={sortOrder} setSortOrder={setSortOrder} />
          </div>

          {searchQuery && (
            <p className="search-results-count">
              Найдено: {displayedProducts.length} товаров
            </p>
          )}

          <Catalog
            displayedProducts={displayedProducts}
            cart={cart}
            onOpenModal={openModal}
            onAddToCart={addToCart}
            searchQuery={searchQuery}
          />
        </>
      )}

      <ScrollTopButton show={showScrollTop} />

      {showOrderHistory && (
        <OrderHistoryModal
          orderHistory={orderHistory}
          onClose={() => setShowOrderHistory(false)}
        />
      )}
    </div>
  );
}

export default App;
