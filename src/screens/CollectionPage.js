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

const GET_PRODUCTS_AND_COLLECTIONS = gql`
  query CollectionAndProducts($handle: String!, $first: Int!) {
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
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
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
    // backgroundColor: "#f8f8f8",
    padding: 10,
    elevation: 2, // for Android
  },
  image: {
    width: "100%",
    height: 250,
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
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: "#4287f5",
    marginHorizontal: 5,
    marginTop: 10,
    marginBottom: 10,
    height: 35,
  },
  pillText: {
    color: "#fff",
  },
});
const PillButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.pill} onPress={onPress}>
    <Text style={styles.pillText}>{title}</Text>
  </TouchableOpacity>
);
const CollectionPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const collectionHandle = route.params ? route.params.collectionHandle : "";

  const { loading, error, data } = useQuery(GET_PRODUCTS_AND_COLLECTIONS, {
    variables: { handle: collectionHandle, first: 20 },
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
  const collectionItems = data.collections.edges;

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

  const renderCollectionItem = ({ item }) => (
    <PillButton
      title={item.node.title}
      onPress={() =>
        navigation.navigate("Collection", {
          collectionHandle: item.node.handle,
        })
      }
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        horizontal
        data={collectionItems}
        renderItem={renderCollectionItem}
        keyExtractor={(item) => item.node.id}
        showsHorizontalScrollIndicator={false}
      />
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
