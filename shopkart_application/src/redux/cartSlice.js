
import { createSlice } from "@reduxjs/toolkit";

const savedCart = localStorage.getItem("shopkart-cart");

const initialState = {
  items: savedCart ? JSON.parse(savedCart) : [],
};

const saveCart = (items) => {
  localStorage.setItem("shopkart-cart", JSON.stringify(items));
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;

      const existing = state.items.find(
        (item) => item.id === product.id
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          ...product,
          quantity,
        });
      }

      saveCart(state.items);
    },

    increase: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }

      saveCart(state.items);
    },

    decrease: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item) {
        item.quantity -= 1;

        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (product) => product.id !== action.payload
          );
        }
      }

      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );

      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const {
  addToCart,
  increase,
  decrease,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
