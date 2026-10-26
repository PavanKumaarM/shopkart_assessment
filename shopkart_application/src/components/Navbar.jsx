
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar({ search = "", setSearch = () => {} }) {
  const items = useSelector(
    (state) => state.cart?.items ?? []
  );

  const wishlist = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const cartCount = items.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Shop<span>Kart</span>
        </Link>

        <div className="header-search">
          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <nav className="nav-links">
          <Link to="/" className="nav-link">
            Products
          </Link>

          <Link to="/wishlist" className="nav-link">
            ♡ Wishlist
            <span className="cart-badge">
              {wishlist.length}
            </span>
          </Link>

          <Link to="/cart" className="cart-link">
            🛒 Cart
            <span className="cart-badge">
              {cartCount}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
