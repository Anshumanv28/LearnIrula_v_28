import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HintSection = ({ hints, AudioButton, isCompleted }) => {
  return (
    <View style={styles.hintContainer}>
      <Text style={styles.hintTitle}>Crossword Hints:</Text>
      <Text style={styles.hintSubTitle}>Across:</Text>
      {hints.across.map((hint, index) => (
        <View key={`across-${index}`} style={styles.hintRow}>
          <Text style={styles.hintText}>{hint}</Text>
          <AudioButton word={hint} direction="across" isCompleted={isCompleted} />
        </View>
      ))}
      <Text style={styles.hintSubTitle}>Down:</Text>
      {hints.down.map((hint, index) => (
        <View key={`down-${index}`} style={styles.hintRow}>
          <Text style={styles.hintText}>{hint}</Text>
          <AudioButton word={hint} direction="down" isCompleted={isCompleted} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  hintContainer: {
    marginBottom: 20,
    maxWidth: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  hintTitle: {
    fontSize: 22, // Slightly bigger font
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  hintSubTitle: {
    fontSize: 20, // Increase subtitle size for clarity
    fontWeight: "bold",
    marginTop: 10,
    color: "#333",
  },
  hintText: {
    fontSize: 18, // Slightly bigger font size for hints
    marginBottom: 10, // Increase space between hints
    color: "#555",
    lineHeight: 24, // Adds more space between lines to fill space
    flexShrink: 1, // Allows text to shrink if too long
    flexWrap: 'wrap', // Wraps text if it's too long
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns icons and text centrally
    marginBottom: 10, // Adds more space between each row
    flexWrap: 'wrap', // Allows row to wrap for long texts
  },
});

export default HintSection;
