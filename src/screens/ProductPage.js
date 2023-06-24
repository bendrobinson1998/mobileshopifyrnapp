import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import { useCart } from "../../CartProvider";

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      title
      images(first: 1) {
        edges {
          node {
            src
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            price
            title
            image {
              transformedSrc
            }
          }
        }
      }
    }
  }
`;

const ProductDetailScreen = ({ route }) => {
  const { id } = route.params;
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id },
  });
  const { addToCart, cartItems } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (data && data.product) {
      const product = data.product;
      setSelectedVariant(product.variants.edges[0].node);
    }
  }, [data]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      console.log("No variant selected");
      return;
    }

    addToCart(selectedVariant, quantity);
    console.log(cartItems);
    console.log("Item added to cart successfully!");
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  if (!data || !selectedVariant)
    return <Text>No product or variant selected</Text>;

  const product = data.product;
  const imageUrl = product.images.edges[0].node.src;

  return (
    <SafeAreaView>
      <ScrollView>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.container}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${selectedVariant.price}</Text>
          <Button title="Add to Cart" onPress={handleAddToCart} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default ProductDetailScreen;
