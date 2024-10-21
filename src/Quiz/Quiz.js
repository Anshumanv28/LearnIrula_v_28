import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import EasyQuiz from "./Easy";
import MediumQuiz from "./Medium";
import HardQuiz from "./Hard";

const Quiz = () => {
  const [difficulty, setDifficulty] = useState(null);

  const handleDifficultySelection = (level) => {
    setDifficulty(level);
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
      <Pressable
        onPress={() => handleDifficultySelection("easy")}
        style={styles.difficultyButton}
      >
        <Text style={styles.difficultyButtonText}>Easy</Text>
      </Pressable>
      <Pressable
        onPress={() => handleDifficultySelection("medium")}
        style={styles.difficultyButton}
      >
        <Text style={styles.difficultyButtonText}>Medium</Text>
      </Pressable>
      <Pressable
        onPress={() => handleDifficultySelection("hard")}
        style={styles.difficultyButton}
      >
        <Text style={styles.difficultyButtonText}>Hard</Text>
      </Pressable>
    </View>
  );

  return <View style={styles.container}>{renderQuizComponent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#f7f7f7",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  difficultyContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  difficultyHeader: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  difficultyButton: {
    backgroundColor: "#4CAF50",
    width: 150,
    paddingVertical: 15,
    borderRadius: 10,
    width: "2rem",
  },
  difficultyButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Quiz;