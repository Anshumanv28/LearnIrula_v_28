// ActivityStackNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ActivityScreen from "./ActivityScreen";
import SpeechCheck from "./Speech";
import Quiz from "./Quiz";
import SCLearn from "./SCLearn";
import SpinWheel from "./SpinWheel";
import Crossword from "./screens/Crossword/Crossword";

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
      {/* <Stack.Screen
        name="Crossword"
        component={Crossword}
        initialParams={{
          grid: [
            ["A", "L", "", "", ""],
            ["", "B", "", "", ""],
            ["", "", "C", "", ""],
            ["", "", "", "D", ""],
            ["", "", "", "", "E"],
          ],
        }}
      /> */}
      <Stack.Screen name="Crossword" component={Crossword} />
    </Stack.Navigator>
  );
};

export default ActivityStackNavigator;
