function CartView({
  cart,
  setCart,
  removingItems,
  addToCart,
  removeFromCart,
  promoInput,
  setPromoInput,
  appliedPromo,
  setAppliedPromo,
  discountPercent,
  setDiscountPercent,
  handleApplyPromo,
  userData,
  handleInputChange,
  orderComment,
  setOrderComment,
  subtotalPrice,
  discountAmount,
  totalPrice,
  isMinOrderReached,
  isFormValid,
  isSubmitting,
  handleCheckout,
  openInfoLink,
  setIsCartOpen,
  showClearConfirm,
  setShowClearConfirm,
  orderHistory,
  setShowOrderHistory,
  MIN_ORDER_AMOUNT,
  TERMS_LINK
}) {
  return (
    <div className="cart-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button className="back-to-catalog-btn" onClick={() => setIsCartOpen(false)} data-testid="back-to-catalog">
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
                <button
                  className="modal-buy-btn"
                  style={{ backgroundColor: '#ff4d4d' }}
                  onClick={() => {
                    setCart([]);
                    localStorage.removeItem('sheepCart');
                    setShowClearConfirm(false);
                  }}
                >
                  Очистить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <h2 style={{ margin: '0 0 16px 0' }}>Оформление заказа</h2>

      {cart.length === 0 ? (
        <div className="empty-cart-container">
          <div className="empty-cart-icon">🛒</div>
          <h3 className="empty-cart-title">Корзина пуста</h3>
          <p className="empty-cart-text">Добавьте товары, чтобы оформить заказ</p>
          <button className="empty-cart-btn" onClick={() => setIsCartOpen(false)}>
            Перейти к покупкам
          </button>
          {orderHistory.length > 0 && (
            <button className="order-history-btn" onClick={() => setShowOrderHistory(true)}>
              📋 История заказов ({orderHistory.length})
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="cart-items-list">
            {cart.map((item) => (
              <div key={item.cartItemId} className={`cart-item ${removingItems.includes(item.cartItemId) ? 'cart-item-removing' : ''}`}>
                <div className="cart-item-img">
                  {item.img && typeof item.img === 'string' && item.img.length > 5 ? (
                    <img src={item.img} alt={item.name} />
                  ) : (
                    item.img
                  )}
                </div>
                <div className="cart-item-info">
                  <h4>
                    {item.name}
                    {item.selectedOption && (
                      <span className="cart-item-option"><br />({item.selectedOption.name})</span>
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

          <div className="promo-section" data-testid="promo-section">
            <input
              type="text"
              placeholder="Промокод"
              value={promoInput}
              data-testid="promo-input"
              onChange={(e) => {
                setPromoInput(e.target.value);
                if (e.target.value.trim() === '') {
                  setAppliedPromo(null);
                  setDiscountPercent(0);
                }
              }}
            />
            <button onClick={handleApplyPromo} data-testid="promo-apply">Применить</button>
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
            <button
              className={`checkout-btn ${!isFormValid || isSubmitting ? 'disabled' : ''}`}
              onClick={handleCheckout}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Отправка..." : (isFormValid ? "🚀 Подтвердить заказ" : "Заполните все поля")}
            </button>
            <p className="terms-text">
              Нажимая кнопку, вы соглашаетесь с <span onClick={() => openInfoLink(TERMS_LINK)}>условиями использования</span>
            </p>
            {orderHistory.length > 0 && (
              <button className="order-history-btn" onClick={() => setShowOrderHistory(true)}>
                📋 История заказов ({orderHistory.length})
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CartView;
