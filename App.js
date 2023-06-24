import React, { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRegistry } from "react-native";
import { useCart } from "./CartProvider";
import ProductStackNavigator from "./src/components/ProductStackNavigator";
import CollectionListPage from "./src/screens/CollectionListPage";
import CollectionPage from "./src/screens/CollectionPage";
import SearchScreen from "./src/screens/SearchScreen";
import CartPage from "./src/screens/CartPage";
import { CartProvider } from "./CartProvider";
import { CheckoutProvider } from "./CheckoutContext";
import Checkout from "./src/screens/Checkout";
import { CREATE_CHECKOUT } from "./CheckoutContext";
const httpLink = createHttpLink({
  uri: "https://wicker-lifestyle.myshopify.com/api/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "X-Shopify-Storefront-Access-Token": "46b0c13dd5bda9503a5525d84fbd2614",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const Tab = createMaterialBottomTabNavigator();
const CollectionStack = createStackNavigator();

function CollectionStackNavigator() {
  return (
    <CollectionStack.Navigator initialRouteName="Collections">
      <CollectionStack.Screen
        name="Collections"
        component={CollectionListPage}
      />
      <CollectionStack.Screen name="Collection" component={CollectionPage} />
    </CollectionStack.Navigator>
  );
}

export default function App() {
  const [checkout, setCheckout] = useState(null);

  const createCheckout = async () => {
    try {
      const lineItems = cartItems.map((item) => {
        console.log(item);
        return {
          variantId: item.variant.id,
          quantity: item.quantity,
        };
      });

      const response = await client.mutate({
        mutation: CREATE_CHECKOUT,
        variables: {
          input: {
            lineItems,
          },
        },
      });

      const { id, webUrl } = response.data.checkoutCreate.checkout;
      setCheckout({ id, lineItems, webUrl });
    } catch (error) {
      console.error("Error initializing checkout:", error);
    }
  };

  useEffect(() => {
    if (!checkout) {
      createCheckout();
    }
  }, [checkout]);

  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <CheckoutProvider>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Home">
                {(props) => (
                  <ProductStackNavigator
                    {...props}
                    checkout={checkout}
                    setCheckout={setCheckout}
                  />
                )}
              </Tab.Screen>
              <Tab.Screen
                name="Collections"
                component={CollectionStackNavigator}
              />
              <Tab.Screen name="Search" component={SearchScreen} />
              <Tab.Screen
                name="Cart"
                component={CartPage}
                initialParams={{ checkoutUrl: checkout?.webUrl }} // Pass checkoutUrl as initialParams
              />
              <Tab.Screen
                name="Checkout"
                component={Checkout}
                initialParams={{ checkoutUrl: checkout?.webUrl }}
                options={{
                  tabBarVisible: false, // Hide the tab bar
                }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </CheckoutProvider>
      </CartProvider>
    </ApolloProvider>
  );
}

AppRegistry.registerComponent("MyApplication", () => App);
