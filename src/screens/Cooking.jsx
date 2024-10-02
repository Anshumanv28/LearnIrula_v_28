import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CookingHome from "./CookingHome";
import CookingIngredients from "./CookingIngredients";
import CookingInstructions from "./CookingInstructions";
const Stack = createNativeStackNavigator();
const Cooking = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="CookingHome"
          component={CookingHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CookingIngredients"
          component={CookingIngredients}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CookingInstructions"
          component={CookingInstructions}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default Cooking;
