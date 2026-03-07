import { IMAGES } from '../images';

function Header({ totalItems, isCartOpen, setIsCartOpen, cartBtnRef }) {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={IMAGES.logo} alt="Logo" className="app-logo" />
        <h1>Sheep To Me</h1>
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
