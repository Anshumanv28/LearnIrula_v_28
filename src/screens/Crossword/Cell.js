import React from "react";
import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");
const cellSize = (width - 40) / 7; // Adjusted to account for the total padding

const Cell = ({ cell, value, onChange, editable, correctAnswer }) => {
  const getCellColor = () => {
    if (!editable) return "#4a4a4a"; // Non-editable cells
    if (!value) return "#ffffff"; // Empty cells
    return value.toUpperCase() === correctAnswer ? "#90EE90" : "#FFB6C1"; // Green for correct, light red for incorrect
  };

  const getGradientColors = () => {
    if (!editable) return ['#4a4a4a', '#333333'];
    if (!value) return ['#ffffff', '#f0f0f0'];
    return value.toUpperCase() === correctAnswer 
      ? ['#90EE90', '#76D7C4'] 
      : ['#FFB6C1', '#FF9AA2'];
  };

  return (
    <View style={styles.cellContainer}>
      {editable ? (
        <LinearGradient
          colors={getGradientColors()}
          style={[styles.cell, { borderColor: value ? '#4a4a4a' : '#cccccc' }]}
        >
          <TextInput
            style={styles.input}
            maxLength={1}
            onChangeText={onChange}
            value={value}
            keyboardType="default"
            autoCapitalize="characters"
            selectTextOnFocus
          />
        </LinearGradient>
      ) : (
        <View style={[styles.cell, { backgroundColor: '#4a4a4a' }]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    margin: 1,
  },
  cell: {
    width: cellSize,
    height: cellSize,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  input: {
    width: cellSize - 2,
    height: cellSize - 2,
    textAlign: "center",
    fontSize: 24,
    fontWeight: 'bold',
    color: "#333",
  },
});

export default Cell;