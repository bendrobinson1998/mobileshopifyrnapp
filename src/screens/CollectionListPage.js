import { gql, useQuery } from "@apollo/client";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GET_COLLECTIONS = gql`
  query GetCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          handle
          title
        }
      }
    }
  }
`;

const CollectionListPage = () => {
  const { loading, error, data, fetchMore } = useQuery(GET_COLLECTIONS, {
    variables: { first: 10 },
    notifyOnNetworkStatusChange: true,
  });

  const navigation = useNavigation();

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! {error.message}</Text>;

  const handleLoadMore = () => {
    if (!data.collections.pageInfo.hasNextPage) return;
    fetchMore({
      variables: {
        first: 10,
        after: data.collections.pageInfo.endCursor,
      },
    });
  };

  return (
    <View style={styles.container}>
      {data.collections.edges.map(({ node }) => (
        <TouchableOpacity
          key={node.id}
          style={styles.item}
          onPress={() =>
            navigation.navigate("Collection", {
              collectionHandle: node.handle,
            })
          }
        >
          <Text style={styles.title}>{node.title}</Text>
        </TouchableOpacity>
      ))}
      {data.collections.pageInfo.hasNextPage && (
        <TouchableOpacity style={styles.item} onPress={handleLoadMore}>
          <Text>Load more...</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CollectionListPage;
