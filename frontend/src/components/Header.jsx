import { useState } from 'react';
import { IMAGES } from '../images';

function Header({ totalItems, isCartOpen, setIsCartOpen, cartBtnRef, theme, setTheme }) {
  const [logoVibrate, setLogoVibrate] = useState(false);

  const handleLogoClick = () => {
    setLogoVibrate(true);
    setTimeout(() => setLogoVibrate(false), 400);
  };

  return (
    <header className="header">
      <div className="logo-container">
        <button
          type="button"
          className={`logo-btn ${logoVibrate ? 'logo-vibrate' : ''}`}
          onClick={handleLogoClick}
          aria-label="Логотип"
        >
          <img src={IMAGES.logo} alt="Logo" className="app-logo" />
        </button>
        <h1>Sheep To Me</h1>
        <div className="theme-switcher theme-switcher-hidden" title="Стиль">
          {['default', 'trendy'].map((t) => (
            <button
              key={t}
              type="button"
              className={`theme-btn ${theme === t ? 'active' : ''}`}
              data-theme={t}
              onClick={() => setTheme(t)}
              title={t === 'default' ? 'Светлая' : 'Тренд'}
              aria-label={t === 'default' ? 'Светлая тема' : 'Тренд'}
            />
          ))}
        </div>
      </div>
      <button
        ref={cartBtnRef}
        className="cart-btn"
        data-testid="cart-btn"
        onClick={() => {
          setIsCartOpen(!isCartOpen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {isCartOpen ? "Закрыть" : (
          <>🛒 Корзина (<span key={totalItems} className="cart-count">{totalItems}</span>)</>
        )}
      </button>
    </header>
  );
}

export default Header;
