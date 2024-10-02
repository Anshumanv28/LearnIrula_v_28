import "react-native-gesture-handler";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabs from "./BottomTabs";
import Home from "../Home";
import Glossary from "../Glossary";

const Stack = createStackNavigator();

function StackNav() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Glossary" component={Glossary} />
    </Stack.Navigator>
  );
}

export default StackNav;
