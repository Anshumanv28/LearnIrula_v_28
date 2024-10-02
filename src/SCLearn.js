import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import Home from "./screens/Home";
const Stack = createNativeStackNavigator();

export default function SCLearn() {
  return (
    <PaperProvider>
         <Home/>
    </PaperProvider>
  );
}