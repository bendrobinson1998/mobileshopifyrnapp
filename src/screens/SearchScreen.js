import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { gql, useLazyQuery } from "@apollo/client";

const SEARCH_PRODUCTS = gql`
  query searchProducts($title: String!) {
    products(first: 10, query: $title) {
      edges {
        node {
          id
          title
          images(first: 1) {
            edges {
              node {
                originalSrc
              }
            }
          }
        }
      }
    }
  }
`;

const SearchScreen = () => {
  const [title, setTitle] = useState("");
  const [searchProducts, { loading, error, data }] =
    useLazyQuery(SEARCH_PRODUCTS);
  const navigation = useNavigation();

  const handleSearch = (value) => {
    setTitle(value);
    if (value.trim() !== "") {
      searchProducts({ variables: { title: value } });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            value={title}
            onChangeText={handleSearch}
            placeholder="Search products..."
          />
        </View>
        {loading && <Text>Loading...</Text>}
        {error && <Text>Error! {error.message}</Text>}
        <ScrollView
          style={styles.resultsContainer}
          keyboardShouldPersistTaps="handled"
        >
          {data?.products.edges.map(({ node }) => (
            <TouchableOpacity
              key={node.id}
              style={styles.productContainer}
              onPress={() =>
                navigation.navigate("ProductDetail", { id: node.id })
              }
            >
              <Image
                style={styles.productImage}
                source={{ uri: node.images.edges[0].node.originalSrc }}
              />
              <Text style={styles.productTitle}>{node.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    padding: 10,
  },
  resultsContainer: {
    flex: 1,
  },
  productContainer: {
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
  productTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SearchScreen;
