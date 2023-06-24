import React, { createContext, useState, useContext, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import { CREATE_CHECKOUT } from "./CheckoutContext";
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [checkout, setCheckout] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0); // New state variable

  const [createCheckout] = useMutation(CREATE_CHECKOUT, {
    onCompleted: (data) => {
      const { id, webUrl } = data.checkoutCreate.checkout;
      setCheckout({ id, webUrl });
    },
    onError: (error) => {
      console.error("Error initializing checkout:", error);
    },
  });

  useEffect(() => {
    if (!checkout) {
      createCheckout();
    }
  }, [checkout, createCheckout]);

  useEffect(() => {
    // Update cartCount whenever cartItems change
    let count = 0;
    cartItems.forEach((item) => {
      count += item.quantity;
    });
    setCartCount(count);
  }, [cartItems]);

  const addToCart = (variant, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.variant.id === variant.id
      );
      if (existingItem) {
        return prevItems.map((item) => {
          if (item.variant.id === variant.id) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });
      } else {
        return [
          ...prevItems,
          {
            variant,
            quantity,
          },
        ];
      }
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.variant.id !== variantId)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }} // Include cartCount in the context value
    >
      {children}
    </CartContext.Provider>
  );
}
