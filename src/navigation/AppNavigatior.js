import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
  
  </Stack.Navigator>
);

export default AppNavigator;
