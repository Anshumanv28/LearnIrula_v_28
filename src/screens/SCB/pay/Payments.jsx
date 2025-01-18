import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PaymentHome from "./PaymentHome";
import PaymentOptions from "./PaymentOptions";
import PaymentInstructions from "./PaymentInstructions";
const Stack = createNativeStackNavigator();
const Payments = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="PaymentHome"
          component={PaymentHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentOptions"
          component={PaymentOptions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentInstructions"
          component={PaymentInstructions}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default Payments;
