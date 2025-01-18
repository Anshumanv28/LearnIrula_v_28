//Spin wheel got corrected by adding feature of  new images every time when clicked
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

const SpinWheel = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const numSections = 8; // Assuming 8 sections
  const rotations = 5;
  const SectionUsed = useRef([0, 0, 0, 0, 0, 0, 0, 0]).current;
  const [word, setWord] = useState(0);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const fetchData = useCallback(() => {
    console.log("Fetching data from API...");
    axios
      .get("https://learnirula.azurewebsites.net/api/")
      .then((response) => {
        const data = response.data;
        AsyncStorage.setItem("data", JSON.stringify(data));
        const shuffledData = data.sort(() => Math.random() - 0.5);
        setData(shuffledData);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const playSound = useCallback(async () => {
    const ff = Math.floor((spinValue._value - 5) * 8);
    const id2 = (8 - ff) % 8;
    const selectedItem = data[id2];

    if (!selectedItem || !selectedItem.audioPath) {
      console.error(
        "Invalid audioPath:",
        selectedItem && selectedItem.audioPath
      );
      return;
    }

    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: selectedItem.audioPath });
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, [data, spinValue]);

  const shuffleData = () => {
    const shuffledData = [...data].sort(() => Math.random() - 0.5);
    setData(shuffledData);
  };

  const resetSections = () => {
    SectionUsed.fill(0); // Reset the array to allow re-use of all sections
  };

  const getRandomSection = (targetSection) => {
    if (SectionUsed[targetSection] !== 1) {
      SectionUsed[targetSection] = 1;
      return targetSection;
    } else {
      let nextSection = (targetSection + 1) % numSections;
      while (SectionUsed[nextSection] === 1) {
        nextSection = (nextSection + 1) % numSections;
      }
      SectionUsed[nextSection] = 1;
      return nextSection;
    }
  };

  const spinWheel = () => {
    shuffleData(); // Shuffle the data before spinning
    spinValue.setValue(0);
    const targetSection = Math.floor(Math.random() * numSections);
    const selectedSection = getRandomSection(targetSection);

    if (SectionUsed.every((section) => section === 1)) {
      resetSections(); // Reset if all sections have been used
    }

    Animated.timing(spinValue, {
      toValue: rotations + selectedSection / numSections,
      duration: 4000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setWord(selectedSection);
      playSound(); // Play the sound when the animation stops
    });
  };

  const ImageWheel = () => {
    const renderImages = useCallback(() => {
      return (
        <View style={styles.container2}>
          <View style={styles.imageContent}>
            {data.slice(0, numSections).map((item, index) => {
              const angleInRadians =
                (((360 / numSections) * index) / 180) * Math.PI;
              const positionX = 145 * Math.cos(angleInRadians);
              const positionY = 145 * Math.sin(angleInRadians);
              return (
                <View
                  key={index}
                  style={{
                    position: "absolute",
                    left: positionX - 37.5,
                    top: positionY - 37.5,
                    transform: [
                      { rotate: `${index * (360 / numSections)}deg` },
                    ],
                  }}
                >
                  <Image
                    source={{ uri: item.picturePath }}
                    style={{ width: 75, height: 75, resizeMode: "contain" }}
                  />
                </View>
              );
            })}
          </View>
        </View>
      );
    }, [data]);
    return renderImages();
  };

  const PictureInfoBox = () => {
    const selectedItem = data[(8 - word) % 8];
    if (!selectedItem || !selectedItem.enWord) {
      return null;
    }
    return (
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          {"English : " + selectedItem.enWord}
        </Text>
        <Text style={styles.infoText}>
          {"Irula : " + selectedItem.irulaWord}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.wheelContainer,
          {
            transform: [
              {
                rotate: spinValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require("./../assets/Material/SpinWheel3.png")}
          style={styles.wheel}
        />
        <ImageWheel />
      </Animated.View>
      <Pressable onPress={spinWheel} style={styles.spinButton}>
        <Text style={styles.spinButtonText}>SPIN</Text>
      </Pressable>
      <Image
        source={require("./../assets/Material/Ratchet1.png")}
        style={styles.ratchet}
      />
      <PictureInfoBox />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#284387",
    paddingTop: 90,
  },
  container2: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 188,
  },
  wheelContainer: {
    alignItems: "center",
    width: 376,
    height: 376,
  },
  wheel: {
    alignItems: "center",
    position: "absolute",
    width: 376,
    height: 376,
  },
  spinButton: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "blue",
    borderRadius: 60,
    padding: 10,
    top: -248,
  },
  ratchet: {
    position: "relative",
    left: 80,
    transform: [{ rotate: "180deg" }],
    top: -335,
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  spinButtonText: {
    fontSize: 25,
    fontFamily: "System",
    fontStyle: "italic",
    color: "yellow",
  },
  imageContent: {
    position: "relative",
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 8,
    position: "absolute",
    bottom: 50,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SpinWheel;
