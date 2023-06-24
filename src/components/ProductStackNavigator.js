import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ProductPage from "../screens/ProductPage";
import Homepage from "../screens/Homepage";

const Stack = createStackNavigator();

function ProductStackNavigator({ checkout, setCheckout, checkoutUrl }) {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Homepage} />
      <Stack.Screen name="ProductDetail" options={{ headerShown: false }}>
        {(props) => (
          <ProductPage
            {...props}
            checkout={checkout}
            setCheckout={setCheckout}
            checkoutUrl={checkoutUrl}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default ProductStackNavigator;
