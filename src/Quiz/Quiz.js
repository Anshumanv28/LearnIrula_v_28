import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, Animated } from "react-native";
import EasyQuiz from "./Easy";
import MediumQuiz from "./Medium";
import HardQuiz from "./Hard";
import { LinearGradient } from 'expo-linear-gradient';

const Quiz = () => {
  const [difficulty, setDifficulty] = useState(null);
  const buttonScale = new Animated.Value(1);

  const handleDifficultySelection = (level) => {
    // Add button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDifficulty(level);
    });
  };

  const renderQuizComponent = () => {
    if (!difficulty) {
      return renderDifficultySelection();
    } else if (difficulty === "easy") {
      return <EasyQuiz />;
    } else if (difficulty === "medium") {
      return <MediumQuiz />;
    } else {
      return <HardQuiz />;
    }
  };

  const renderDifficultySelection = () => (
    <View style={styles.difficultyContainer}>
      <Text style={styles.difficultyHeader}>Select Difficulty Level</Text>
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            onPress={() => handleDifficultySelection("easy")}
            style={({ pressed }) => [
              styles.difficultyButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.gradient}
            >
              <Text style={styles.difficultyButtonText}>Easy</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            onPress={() => handleDifficultySelection("medium")}
            style={({ pressed }) => [
              styles.difficultyButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={['#FFA726', '#FB8C00']}
              style={styles.gradient}
            >
              <Text style={styles.difficultyButtonText}>Medium</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            onPress={() => handleDifficultySelection("hard")}
            style={({ pressed }) => [
              styles.difficultyButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={['#EF5350', '#E53935']}
              style={styles.gradient}
            >
              <Text style={styles.difficultyButtonText}>Hard</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f7f7f7', '#e8e8e8']}
        style={styles.background}
      >
        {renderQuizComponent()}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  difficultyContainer: {
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  difficultyHeader: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,
    color: "#333",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  difficultyButton: {
    width: 200,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  difficultyButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});

export default Quiz;