
import { Link } from "react-router-dom";

function EmptyCart() {
  return (
    <main className="page-container">
      <section className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/" className="primary-button shop-button">
          Continue shopping
        </Link>
      </section>
    </main>
  );
}

export default EmptyCart;
