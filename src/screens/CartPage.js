import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useCart } from "../../CartProvider";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const CartPage = () => {
  const { cartItems, removeFromCart, cartCount } = useCart();
  const [totalCost, setTotalCost] = useState(0);
  const navigation = useNavigation();
  const route = useRoute();
  const { checkoutUrl } = route.params;

  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => {
      const variantPrice = item.variant?.price;
      if (variantPrice) {
        const itemCost = variantPrice * item.quantity;
        total += itemCost;
      }
    });
    setTotalCost(total);
  }, [cartItems]);

  const handleProceedToCheckout = () => {
    navigation.navigate("Checkout", { checkoutUrl });
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.title}</Text>
        <Text style={styles.productPrice}>Price: ${item.variant.price}</Text>
        <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromCart(item.variant.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#888" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      {cartCount === 0 ? (
        <Text style={styles.emptyCart}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.variant.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {cartCount > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Cost of Cart:</Text>
          <Text style={styles.totalAmount}>
            ${totalCost.toFixed(2)} ({cartCount} items)
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.proceedButton}
        onPress={handleProceedToCheckout}
      >
        <Text style={styles.proceedButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emptyCart: {
    fontSize: 18,
    color: "#888",
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 5,
  },
  productDetails: {
    flex: 1,
    marginRight: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#888",
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 16,
  },
  removeButton: {
    padding: 10,
  },
  totalContainer: {
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
  },
  proceedButton: {
    backgroundColor: "blue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  proceedButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartPage;
