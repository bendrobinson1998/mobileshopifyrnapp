import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import { useCheckout } from "../../CheckoutContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Checkout = () => {
  const route = useRoute();
  const { checkout } = useCheckout();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (checkout && checkout.webUrl) {
      setIsLoading(false);
    }
  }, [checkout]);

  const saveCheckoutId = async (checkoutId) => {
    try {
      await AsyncStorage.setItem("checkoutId", checkoutId);
    } catch (error) {
      console.error("Error saving checkout ID:", error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: checkout.webUrl }}
        onNavigationStateChange={(state) => {
          if (state.url.startsWith("https://your-store.com/checkout/order-received")) {
            saveCheckoutId(checkout.id);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Checkout;
