import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const cellSize = (width - 40) / 7; // Adjusted to account for the total padding

const Cell = ({ cell, value, onChange, editable, correctAnswer }) => {
  const getCellColor = () => {
    if (!editable) return "#4a4a4a"; // Non-editable cells
    if (!value) return "#ffffff"; // Empty cells
    return value.toUpperCase() === correctAnswer ? "#90EE90" : "#FFB6C1"; // Green for correct, light red for incorrect
  };

  return (
    <View style={[styles.cell, { backgroundColor: getCellColor() }]}>
      {editable && (
        <TextInput
          style={styles.input}
          maxLength={1}
          onChangeText={onChange}
          value={value}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4a4a4a",
    margin: 1,
  },
  input: {
    width: cellSize - 2,
    height: cellSize - 2,
    textAlign: "center",
    fontSize: 24,
    color: "#333",
  },
});

export default Cell;