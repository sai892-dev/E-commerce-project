"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { 
        product: product._id, 
        name: product.name, 
        price: product.price, 
        quantity,
        image: product.image 
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product !== productId));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
