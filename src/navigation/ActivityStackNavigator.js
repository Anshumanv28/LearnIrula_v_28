// ActivityStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ActivityScreen from "../ActivityScreen";
import SpeechCheck from "../Speech";
import Quiz from "../Quiz/Quiz";
import SCLearn from "./SCLearn";
import SpinWheel from "../SpinWheel";
import Crossword from "../screens/Crossword/Crossword";
import Jumbleword from "../Jumbleword";
import MLScreen from "../MLScreen";
import Test from "../Test";

const Stack = createStackNavigator();

const ActivityStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ActivityScreen">
      <Stack.Screen
        name="ActivityScreen"
        component={ActivityScreen}
        options={{ title: "Activities" }}
      />
      <Stack.Screen name="SpeechCheck" component={SpeechCheck} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="SCLearn" component={SCLearn} />
      <Stack.Screen name="SpinWheel" component={SpinWheel} />
      <Stack.Screen name="Crossword" component={Crossword} />
      <Stack.Screen name="Jumbleword" component={Jumbleword} />
      <Stack.Screen name="MLScreen" component={MLScreen} />
      <Stack.Screen name="Test" component={Test}/>
    </Stack.Navigator>
  );
};

export default ActivityStackNavigator;
