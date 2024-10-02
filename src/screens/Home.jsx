import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import Cooking from "./Cooking";
import Activites from "./Activites";
import Payments from "./Payments";
const Stack = createNativeStackNavigator();
const Home = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name="Activites"
          component={Activites}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cooking"
          component={Cooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Payments"
          component={Payments}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default Home;
