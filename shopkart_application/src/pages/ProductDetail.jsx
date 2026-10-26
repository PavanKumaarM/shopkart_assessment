import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/productsSlice";
import {
  addToCart,
  increase,
  decrease,
} from "../redux/cartSlice";

import "../App.css";

function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector(
    (state) =>
      state.products?.items ??
      state.products?.products ??
      []
  );

  const cartItems = useSelector(
    (state) => state.cart?.items ?? []
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [id]);

  const product = products.find(
    (item) => String(item.id) === String(id)
  );

  const cartItem = cartItems.find(
    (item) => String(item.id) === String(id)
  );

  const relatedProducts = products
    .filter(
      (item) =>
        String(item.id) !== String(id) &&
        item.category === product?.category
    )
    .slice(0, 4);

  const formatPrice = (price) =>
    `$${Number(price || 0).toFixed(2)}`;

  const handleAddToCart = () => {
    if (!product) return;

    dispatch(
      addToCart({
        product,
        quantity,
      })
    );
  };

  const handleIncrease = () => {
    if (cartItem) {
      dispatch(increase(cartItem.id));
    } else {
      setQuantity((previous) => previous + 1);
    }
  };

  const handleDecrease = () => {
    if (cartItem) {
      dispatch(decrease(cartItem.id));
    } else {
      setQuantity((previous) =>
        Math.max(1, previous - 1)
      );
    }
  };

  if (!product) {
    return (
      <main className="pdp-container">
        <div className="pdp-not-found">
          <h2>Product not found</h2>
          <p>
            We couldn't find a product with ID {id}.
          </p>

          <Link to="/" className="pdp-primary-button">
            Back to products
          </Link>
        </div>
      </main>
    );
  }

  const rating = product.rating?.rate ?? 0;
  const reviews = product.rating?.count ?? 0;

  // The API supplies one main image per product.
  // The four thumbnails use that image and remain clickable.
  const productImages = Array(4).fill(product.image);

  return (
    <main className="pdp-container">
      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <Link to="/">Products</Link>
        <span>/</span>

        <Link
          to={`/?category=${encodeURIComponent(
            product.category
          )}`}
        >
          {product.category}
        </Link>

        <span>/</span>

        <strong>{product.title}</strong>
      </div>

      {/* Product details */}
      <section className="pdp-card">
        {/* Left: Product gallery */}
        <div className="pdp-gallery">
          <div className="pdp-main-image">
            <img
              src={productImages[selectedImage]}
              alt={product.title}
            />
          </div>

          <div className="pdp-thumbnails">
            {productImages.map((image, index) => (
              <button
                type="button"
                key={`${product.id}-${index}`}
                className={`pdp-thumbnail ${
                  selectedImage === index ? "active" : ""
                }`}
                onClick={() => setSelectedImage(index)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={selectedImage === index}
              >
                <img
                  src={image}
                  alt={`${product.title} view ${index + 1}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product information */}
        <div className="pdp-information">
          <span className="pdp-category">
            {product.category}
          </span>

          <h1 className="pdp-title">
            {product.title}
          </h1>

          <div className="pdp-rating">
            <span className="pdp-stars" aria-label={`${rating} out of 5`}>
              {"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}
              <span className="pdp-empty-star">
                {"☆".repeat(
                  5 -
                    Math.max(
                      0,
                      Math.min(5, Math.round(rating))
                    )
                )}
              </span>
            </span>

            <strong>{Number(rating).toFixed(1)}</strong>

            <span className="pdp-review-count">
              ({reviews} reviews)
            </span>
          </div>

          <div className="pdp-price">
            {formatPrice(product.price)}
          </div>

          <p className="pdp-description">
            {product.description}
          </p>

          <div className="pdp-divider" />

          {/* Quantity */}
          <div className="pdp-quantity-row">
            <span className="pdp-quantity-label">
              Quantity
            </span>

            <div className="pdp-quantity-control">
              <button
                type="button"
                onClick={handleDecrease}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>
                {cartItem
                  ? cartItem.quantity
                  : quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrease}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="pdp-buttons">
            <button
              type="button"
              className="pdp-primary-button pdp-add-button"
              onClick={handleAddToCart}
            >
              <span aria-hidden="true">🛒</span>
              Add to cart
            </button>

            <button
              type="button"
              className="pdp-secondary-button"
              onClick={() => navigate("/cart")}
            >
              Go to cart
            </button>
          </div>

          {/* Delivery information */}
          <div className="pdp-benefits">
            <p>
              <span className="pdp-benefit-icon">▣</span>
              Free shipping on orders of $100 or more
            </p>

            <p>
              <span className="pdp-benefit-icon">↻</span>
              30-day easy returns
            </p>
          </div>
        </div>
      </section>

      {/* Recommended products */}
      {relatedProducts.length > 0 && (
        <section className="pdp-recommendations">
          <h2>You may also like</h2>

          <div className="pdp-recommendation-grid">
            {relatedProducts.map((item, index) => (
              <Link
                to={`/product/${item.id}`}
                className="pdp-recommendation-card"
                key={item.id}
                onClick={() => {
                  setSelectedImage(0);
                  setQuantity(1);
                }}
              >
                <div
                  className={`pdp-recommendation-image pdp-color-${index % 4}`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                <h3>{item.title}</h3>

                <p>{formatPrice(item.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default ProductDetail;