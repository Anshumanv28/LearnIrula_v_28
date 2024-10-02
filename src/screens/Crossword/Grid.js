import React from "react";
import { View, StyleSheet } from "react-native";
import Cell from "./Cell";

const Grid = ({ grid, inputs, onChange, correctAnswers }) => {
  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View style={styles.row} key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              value={inputs[rowIndex][colIndex]}
              onChange={(value) => onChange(rowIndex, colIndex, value)}
              editable={!!correctAnswers[rowIndex][colIndex]}
              correctAnswer={correctAnswers[rowIndex][colIndex]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
});

export default Grid;