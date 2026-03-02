function AgeModal({ onConfirm, onDeny }) {
  return (
    <div className="modal-overlay age-modal-overlay">
      <div className="modal-content age-modal-content">
        <div className="age-icon">🔞</div>
        <h2>Вам есть 18 лет?</h2>
        <p>Этот раздел содержит товары для взрослых. Пожалуйста, подтвердите ваш возраст.</p>
        <div className="modal-buttons-row">
          <button className="modal-info-btn deny-btn" onClick={onDeny}>Нет</button>
          <button className="modal-buy-btn confirm-btn" onClick={onConfirm}>Да, мне 18+</button>
        </div>
      </div>
    </div>
  );
}

export default AgeModal;
