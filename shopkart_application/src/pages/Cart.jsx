
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  increase,
  decrease,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";
import EmptyCart from "./EmptyCart";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = subtotal >= 100 ? 0 : 5;
  const total = subtotal + shipping;

  return (
    <main className="page-container">
      <div className="cart-heading">
        <div>
          <h1>Shopping cart</h1>
          <p className="muted">
            {items.reduce((sum, item) => sum + item.quantity, 0)} items
            in your cart
          </p>
        </div>

        <button
          className="clear-button"
          onClick={() => dispatch(clearCart())}
        >
          Clear cart
        </button>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <Link
                to={`/product/${item.id}`}
                className="cart-item-image"
              >
                <img src={item.image} alt={item.title} />
              </Link>

              <div>
                <span className="product-category">
                  {item.category}
                </span>

                <Link
                  to={`/product/${item.id}`}
                  className="cart-item-title"
                >
                  {item.title}
                </Link>

                <p className="cart-unit-price">
                  ${item.price.toFixed(2)} each
                </p>

                <button
                  className="remove-button"
                  onClick={() =>
                    dispatch(removeFromCart(item.id))
                  }
                >
                  Remove
                </button>
              </div>

              <div className="cart-item-end">
                <div className="quantity-control">
                  <button
                    onClick={() => dispatch(decrease(item.id))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => dispatch(increase(item.id))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <strong className="line-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </strong>
              </div>
            </article>
          ))}

          <Link to="/" className="continue-link">
            ← Continue shopping
          </Link>
        </section>

        <aside className="order-summary">
          <h2>Order summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className={shipping === 0 ? "free-shipping" : ""}>
              {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {shipping > 0 && (
            <p className="shipping-hint">
              Add ${(100 - subtotal).toFixed(2)} more for free shipping.
            </p>
          )}

          <div className="summary-divider" />

          <div className="summary-row total-row">
            <strong>Total</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>

          <button
            className="primary-button checkout-button"
            onClick={() =>
              alert("Checkout is not connected yet.")
            }
          >
            Proceed to checkout
          </button>

          <p className="shipping-hint" style={{ marginTop: 10 }}>
            Shipping is calculated based on your order subtotal.
          </p>
        </aside>
      </div>
    </main>
  );
}

export default Cart;
