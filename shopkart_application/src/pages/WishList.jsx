
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromWishlist,
  clearWishlist,
} from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const items = useSelector(
    (state) => state.wishlist.items
  );

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
  };

  if (items.length === 0) {
    return (
      <main className="page-container">
        <div className="page-heading">
          <div>
            <h1>My Wishlist ♡</h1>
            <p className="muted">
              Your favorite products will appear here.
            </p>
          </div>
        </div>

        <section className="empty-cart">
          <div className="empty-cart-icon">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>
            Save products you love and find them here later.
          </p>
          <Link to="/" className="primary-button shop-button">
            Explore products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>My Wishlist ♡</h1>
          <p className="muted">
            {items.length} saved product{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          className="clear-button"
          onClick={() => dispatch(clearWishlist())}
        >
          Clear wishlist
        </button>
      </div>

      <div className="product-grid">
        {items.map((product) => (
          <article className="product-card" key={product.id}>
            <Link
              to={`/product/${product.id}`}
              className="product-image"
            >
              <img src={product.image} alt={product.title} />
            </Link>

            <div className="product-info">
              <span className="product-category">
                {product.category}
              </span>

              <Link
                to={`/product/${product.id}`}
                className="product-title"
              >
                {product.title}
              </Link>

              <div className="rating">
                <span className="star">★</span>
                <strong>{product.rating?.rate ?? "—"}</strong>
                <span className="review-count">
                  ({product.rating?.count ?? 0} reviews)
                </span>
              </div>

              <div className="product-bottom">
                <strong className="product-price">
                  ${product.price.toFixed(2)}
                </strong>

                <button
                  className="primary-button add-button"
                  onClick={() => handleMoveToCart(product)}
                >
                  Add to cart
                </button>
              </div>

              <button
                className="remove-button"
                onClick={() =>
                  dispatch(removeFromWishlist(product.id))
                }
              >
                ♥ Remove from wishlist
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

export default Wishlist;
