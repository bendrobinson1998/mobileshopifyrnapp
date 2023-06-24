import React, { createContext, useState, useContext, useEffect } from "react";
import { useMutation, gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CREATE_CHECKOUT = gql`
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

const CHECKOUT_STORAGE_KEY = "checkoutId";

const CheckoutContext = createContext();

export function useCheckout() {
  return useContext(CheckoutContext);
}

export function CheckoutProvider({ children }) {
  const [checkout, setCheckout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createCheckout] = useMutation(CREATE_CHECKOUT);

  useEffect(() => {
    initializeCheckout();
  }, []);

  const initializeCheckout = async () => {
    try {
      const storedCheckoutId = await AsyncStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (storedCheckoutId) {
        setCheckout({ id: storedCheckoutId });
        setLoading(false);
      } else {
        const { data } = await createCheckout();
        const checkoutData = data.checkoutCreate.checkout;
        setCheckout(checkoutData);
        await AsyncStorage.setItem(CHECKOUT_STORAGE_KEY, checkoutData.id);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initializing checkout:", error);
      setLoading(false);
    }
  };

  return (
    <CheckoutContext.Provider value={{ checkout, setCheckout, loading }}>
      {loading ? null : children}
    </CheckoutContext.Provider>
  );
}
