function Toast({ message, isClosing }) {
  const isCart = message && (message.includes('Добавлено') || message.includes('добавлено'));
  const isSuccess = message && (message.includes('✅') || message.includes('🎉') || message.includes('применен') || message.includes('открыт'));
  const isError = message && message.includes('❌');

  return (
    <div
      className={`toast ${message ? (isClosing ? 'toast-closing' : 'show') : ''}`}
      role="alert"
    >
      <div className="toast-inner">
        <span className="toast-icon" aria-hidden="true">
          {isCart ? '🛒' : isError ? '⚠️' : isSuccess ? '✓' : '•'}
        </span>
        <span className="toast-message">{message}</span>
      </div>
      {message && <div key={message} className="toast-progress" />}
    </div>
  );
}

export default Toast;
