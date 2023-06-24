import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useNavigation, useRoute } from "@react-navigation/native";

const GET_PRODUCTS_COLLECTION = gql`
  query CollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      id
      description
      products(first: 250) {
        edges {
          node {
            id
            description
            title
            featuredImage {
              src
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  sku
                  price
                  compareAtPrice
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    flex: 1,
    margin: 10,
    backgroundColor: "#f8f8f8",
    padding: 10,
    elevation: 2, // for Android
  },
  image: {
    width: "100%",
    height: "75%",
    resizeMode: "cover",
  },
  title: {
    marginTop: 10,
    fontWeight: "bold",
  },
  price: {
    marginTop: 10,
    color: "#888",
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  compareAtPrice: {
    marginTop: 5,
    color: "#aaa",
    textDecorationLine: "line-through",
  },
});

const CollectionPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const collectionHandle = route.params ? route.params.collectionHandle : "";

  const { loading, error, data } = useQuery(GET_PRODUCTS_COLLECTION, {
    variables: { handle: collectionHandle },
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (error) return <Text>Error! {error.message}</Text>;
  if (!data.collectionByHandle) return <Text>No collection found.</Text>;

  const productData = data.collectionByHandle.products.edges;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("ProductDetail", { id: item.node.id })}
    >
      <Image
        style={styles.image}
        source={{ uri: item.node.featuredImage.src }}
      />
      <Text style={styles.title}>{item.node.title}</Text>
      <Text style={styles.price}>
        ${item.node.variants.edges[0].node.price}
      </Text>
      {item.compareAtPrice && (
        <Text style={styles.compareAtPrice}>Was ${variant.compareAtPrice}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={productData}
        renderItem={renderItem}
        keyExtractor={(item) => item.node.id}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        numColumns={2}
      />
    </View>
  );
};

export default CollectionPage;
