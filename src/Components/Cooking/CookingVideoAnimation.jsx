import React, { useState, useEffect } from "react";
import { Animated, View } from "react-native";

const CookingVideoAnimation = () => {
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      delay: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={{}}>
      <Animated.Image
        source={require("./cooking.png")}
        style={{ opacity: animatedValue }}
        className="w-80 h-80"
      />
    </View>
  );
};

export default CookingVideoAnimation;
