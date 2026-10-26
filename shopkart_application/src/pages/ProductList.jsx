
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/productsSlice";
import {
  addToCart,
  increase,
  decrease,
} from "../redux/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

const categories = [
  "All",
  "Electronics",
  "Jewelry",
  "Men's clothing",
  "Women's clothing",
];

const PRODUCTS_PER_PAGE = 10;

const categoryMap = {
  Electronics: "electronics",
  Jewelry: "jewelery",
  "Men's clothing": "men's clothing",
  "Women's clothing": "women's clothing",
};

function ProductList({ search = "" }) {
  const dispatch = useDispatch();

  const {
    items = [],
    status,
    error,
  } = useSelector((state) => state.products);

  const cartItems = useSelector(
    (state) => state.cart?.items ?? []
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items ?? []
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "All";

  const [sort, setSort] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  const setCategory = (value) => {
    if (value === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: value });
    }
  };

  const filteredProducts = useMemo(() => {
    let result = items.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === categoryMap[category];

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result = [...result].sort(
        (a, b) => a.price - b.price
      );
    } else if (sort === "high") {
      result = [...result].sort(
        (a, b) => b.price - a.price
      );
    } else if (sort === "rating") {
      result = [...result].sort(
        (a, b) =>
          (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)
      );
    }

    return result;
  }, [items, category, sort, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, Math.max(1, totalPages))
    );
  }, [totalPages]);

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  const toggleWishlist = (product) => {
    const isWishlisted = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  if (status === "loading" || status === "idle") {
    return (
      <main className="page-container">
        <div className="state-card">
          <div className="spinner" />
          <h2>Loading products...</h2>
        </div>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="page-container">
        <div className="state-card">
          <h2>Unable to load products</h2>
          <p>{error || "Please try again."}</p>

          <button
            className="primary-button"
            onClick={() => dispatch(fetchProducts())}
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>
            {category === "All" ? "All products" : category}
          </h1>

          <p className="muted">
            Showing {filteredProducts.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + PRODUCTS_PER_PAGE,
              filteredProducts.length
            )}{" "}
            of {filteredProducts.length} products
          </p>
        </div>

        <label className="sort-control">
          <span>Sort by</span>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>
      </div>

      <div className="category-chips">
        {categories.map((item) => (
          <button
            key={item}
            className={`category-chip ${
              category === item ? "active" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="state-card">
          <h2>No products found</h2>
          <p>Try another search or category.</p>

          <button
            className="primary-button"
            onClick={() => {
              setCategory("All");
              setSort("featured");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {currentProducts.map((product) => {
              const cartItem = cartItems.find(
                (item) => item.id === product.id
              );

              const quantity = cartItem?.quantity ?? 0;

              const isWishlisted = wishlistItems.some(
                (item) => item.id === product.id
              );

              return (
                <article
                  className="product-card"
                  key={product.id}
                >
                  <button
                    type="button"
                    className={`wishlist-heart ${
                      isWishlisted ? "wishlisted" : ""
                    }`}
                    onClick={() => toggleWishlist(product)}
                    aria-label={
                      isWishlisted
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                    aria-pressed={isWishlisted}
                  >
                    {isWishlisted ? "♥" : "♡"}
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    className="product-image"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                    />
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
                      <strong>
                        {product.rating?.rate ?? "N/A"}
                      </strong>
                      <span className="review-count">
                        ({product.rating?.count ?? 0} reviews)
                      </span>
                    </div>

                    <div className="product-bottom">
                      <strong className="product-price">
                        ${product.price.toFixed(2)}
                      </strong>

                      {quantity === 0 ? (
                        <button
                          type="button"
                          className="primary-button add-button"
                          onClick={() =>
                            dispatch(
                              addToCart({
                                product,
                                quantity: 1,
                              })
                            )
                          }
                        >
                          Add to cart
                        </button>
                      ) : (
                        <div className="quantity-control">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              dispatch(decrease(product.id))
                            }
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              dispatch(increase(product.id))
                            }
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav
              className="pagination"
              aria-label="Product pagination"
            >
              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
              >
                ← Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  type="button"
                  key={page}
                  className={`pagination-button ${
                    currentPage === page ? "active" : ""
                  }`}
                  aria-current={
                    currentPage === page ? "page" : undefined
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  );
}

export default ProductList;
