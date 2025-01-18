// import 'react-native-gesture-handler';
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import BottomTabs from "./src/nav/BottomTabs";
// function App() {
//   return (
//     <NavigationContainer>
//       <BottomTabs />
//     </NavigationContainer>
//   );
// }

// export default App;

import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabs from "./src/navigation/BottomTabs";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
