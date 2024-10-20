import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

// Sample words array for demonstration purposes
const words = [
  "apple",
  "banana",
  "orange",
  "grape",
  "watermelon",
  "strawberry",
  "blueberry",
  "raspberry",
  "kiwi",
  "pineapple",
];

const gridSize = 20;
const attemptsToFitWords = 5000;
const gridsToMake = 20;

const CrosswordPuzzle = () => {
  const [grid, setGrid] = useState(
    Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(""))
  );
  const [usedWords, setUsedWords] = useState([]); // Define usedWords as an empty array

  useEffect(() => {
    createCrosswordPuzzle();
  }, []);

  const createCrosswordPuzzle = () => {
    const generatedGrids = [];

    const attemptToPlaceWordOnGrid = (word) => {
      for (let row = 0; row < gridSize; ++row) {
        for (let column = 0; column < gridSize; ++column) {
          const isVertical = Math.random() >= 0.5;
          if (isLetter(row, column)) {
            if (updateGrid(row, column, word, isVertical)) {
              setUsedWords((prev) => [...prev, word]); // Add the word to usedWords
              return true;
            }
          }
        }
      }
      return false;
    };

    const generateGrids = () => {
      for (let gridsMade = 0; gridsMade < gridsToMake; gridsMade++) {
        const newGrid = Array(gridSize)
          .fill()
          .map(() => Array(gridSize).fill(""));
        let continuousFails = 0;

        for (let attempts = 0; attempts < attemptsToFitWords; attempts++) {
          const word = getRandomWord();
          const placed = attemptToPlaceWordOnGrid(word);
          if (placed) {
            continuousFails = 0;
          } else {
            continuousFails++;
          }
          if (continuousFails > 470) {
            break;
          }
        }

        generatedGrids.push(newGrid);
      }
    };

    const getRandomWord = () => {
      let word;
      do {
        word = words[Math.floor(Math.random() * words.length)];
      } while (usedWords.includes(word));
      return word;
    };

    const updateGrid = (row, column, word, isVertical) => {
      const newGrid = [...grid];
      if (isVertical) {
        for (let i = 0; i < word.length; i++) {
          if (row + i >= gridSize || newGrid[row + i][column]) return false;
        }
        for (let i = 0; i < word.length; i++) {
          newGrid[row + i][column] = word[i];
        }
      } else {
        for (let i = 0; i < word.length; i++) {
          if (column + i >= gridSize || newGrid[row][column + i]) return false;
        }
        for (let i = 0; i < word.length; i++) {
          newGrid[row][column + i] = word[i];
        }
      }
      setGrid(newGrid);
      return true;
    };

    const isLetter = (row, column) => grid[row][column] !== "";

    const getBestGrid = (grids) => {
      // Implement your logic to evaluate grids and find the best one
      return grids[0]; // Placeholder for now
    };

    generateGrids();
    const bestGrid = getBestGrid(generatedGrids);
    setGrid(bestGrid);
  };

  return (
    <View style={styles.grid}>
      {grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, colIndex) => (
            <View key={colIndex} style={styles.cell}>
              <Text>{cell}</Text>
            </View>
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
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#e9e9e9",
    backgroundColor: "#e9e9e9",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  },
});

export default CrosswordPuzzle;
