function OrderHistoryModal({ orderHistory, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content order-history-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        <h2>📋 История заказов</h2>
        
        {orderHistory.length === 0 ? (
          <div className="empty-history">
            <div className="empty-history-icon">📦</div>
            <p>У вас пока нет заказов</p>
          </div>
        ) : (
          <ul className="order-history-list">
            {orderHistory.map((order) => (
              <li key={order.id} className="order-history-item">
                <div className="order-header">
                  <span className="order-date">{order.date}</span>
                  <span className="order-total">{order.total} ₽</span>
                </div>
                <ul className="order-items">
                  {order.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      {item.optionName ? `${item.name} (${item.optionName})` : item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default OrderHistoryModal;
