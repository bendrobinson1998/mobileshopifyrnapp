import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Button,
  ScrollView,
} from "react-native";
import { useApolloClient } from "@apollo/client";
import { gql } from "@apollo/client";

const GET_COLLECTIONS = gql`
  {
    collections(first: 10) {
      edges {
        node {
          id
          title
          handle
          image {
            transformedSrc
          }
          products(first: 1) {
            edges {
              node {
                images(first: 1) {
                  edges {
                    node {
                      transformedSrc
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const windowWidth = Dimensions.get("window").width;
const bannerHeight = windowWidth * 0.6;
// Custom Button Component
function CustomButton({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: "white",
        padding: 13,
        borderRadius: 5,
        marginTop: 30,
      }}
    >
      <Text style={{ color: "black", fontSize: 16 }}>{title}</Text>
    </TouchableOpacity>
  );
}
function HomeScreen({ navigation }) {
  const [collections, setCollections] = useState([]);
  const client = useApolloClient();
  const specificCollectionHandle = "shop-now-kitchen-tablelinen";
  useEffect(() => {
    client
      .query({ query: GET_COLLECTIONS })
      .then((result) =>
        setCollections(result.data.collections.edges.map((edge) => edge.node))
      )
      .catch((error) => console.error("Error fetching collections:", error));
  }, [client]);

  const renderItem = ({ item }) => {
    let imageUrl = item.image ? item.image.transformedSrc : null;
    if (
      !imageUrl &&
      item.products.edges.length > 0 &&
      item.products.edges[0].node.images.edges.length > 0
    ) {
      imageUrl =
        item.products.edges[0].node.images.edges[0].node.transformedSrc;
    }

    return (
      <TouchableOpacity
        style={{ flex: 1, margin: 10 }}
        onPress={() =>
          navigation.navigate("Collections", {
            screen: "Collection",
            params: { collectionHandle: item.handle },
          })
        }
      >
        {imageUrl && (
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: imageUrl }}
          />
        )}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 5,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      {/* Promotion Banner */}
      <View
        style={{
          width: windowWidth,
          height: bannerHeight / 4,
          backgroundColor: "#59B979",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 15, color: "white", textAlign: "center" }}>
          🌟 Clearance Sale! Get an extra 20% OFF at checkout with code: LUX20
        </Text>
      </View>
      {/* Hero Banner */}
      <View style={{ width: windowWidth, height: bannerHeight }}>
        <Image
          source={require("../../assets/hero_banner.jpg")}
          style={{ width: "100%", height: "100%", position: "absolute" }}
        />
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 24, color: "white", textAlign: "center" }}>
            Soft & comfy things to help you wind down well
          </Text>
          <CustomButton
            title="Find Your Dream Bedlinen"
            onPress={() =>
              navigation.navigate("Collections", {
                screen: "Collection",
                params: { collectionHandle: specificCollectionHandle },
              })
            }
          />
        </View>
      </View>

      <Text style={{ fontSize: 24, fontWeight: "bold", margin: 15 }}>
        Welcome to Roomie Design
      </Text>

      <FlatList
        data={collections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Collections", {
            screen: "Collection",
            params: { collectionHandle: specificCollectionHandle },
          })
        }
      >
        <View
          style={{
            width: windowWidth,
            height: bannerHeight / 4,
            backgroundColor: "#967bb6",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 19,
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Shop Luxury Duvets Now &#8594;
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

export default HomeScreen;
