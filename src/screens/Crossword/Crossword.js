import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  Button,
  Alert,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Audio } from 'expo-av';
import HintSection from "./HintSection";
import Grid from "./Grid";
import crosswords from "./CrosswordData";
import useCrossword from "./UseCrossword";

const { width } = Dimensions.get("window");
const cellSize = (width - 40) / 7;

const Crossword = ({ route, navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedCrossword = crosswords[currentIndex];
  const { hints, audioLinks } = selectedCrossword;
  const { inputs, handleChange, handleSubmit, isCompleted } = useCrossword(selectedCrossword);
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const onSubmit = () => {
    const isCorrect = handleSubmit();
    if (isCorrect) {
      Alert.alert("Success!", "All answers are correct! You can now play the audio for each word.");
    } else {
      Alert.alert("Try Again", "Some answers are incorrect.");
    }
  };

  const handleNext = () => {
    if (currentIndex < crosswords.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert("End of Crosswords", "You have reached the end of the crosswords.");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      Alert.alert("Start of Crosswords", "You are at the beginning of the crosswords.");
    }
  };

  const playAudio = async (audioPath) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: audioPath });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert('Error', 'Failed to play audio. Please try again.');
    }
  };

  const AudioButton = ({ word, direction }) => {
    const getAudioKey = (word, direction) => {
      // Extract the number (including decimal) at the beginning of the hint
      const match = word.match(/^(\d+(\.\d+)?)/);
      if (match) {
        // If it's a decimal number, include parentheses
        const key = match[2] ? `(${match[1]})` : match[1];
        return `${direction}-${key}`;
      }
      // Fallback to the first word if no number is found
      return `${direction}-${word.split(' ')[0]}`;
    };

    const audioKey = getAudioKey(word, direction);
    const audioUrl = audioLinks[audioKey];

    console.log('Audio Key:', audioKey);
    console.log('Audio URL:', audioUrl);

    return (
      <TouchableOpacity
        style={styles.audioButton}
        onPress={() => audioUrl && playAudio(audioUrl)}
        disabled={!isCompleted || !audioUrl}
      >
        <Text style={styles.audioButtonText}>🔊</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HintSection hints={hints} AudioButton={AudioButton} isCompleted={isCompleted} />
      <View style={styles.gridContainer}>
        <Grid
          grid={selectedCrossword.grid}
          inputs={inputs}
          onChange={handleChange}
          correctAnswers={selectedCrossword.correctAnswers}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Previous" onPress={handlePrevious} />
        <Button title="Submit" onPress={onSubmit} />
        <Button title="Next" onPress={handleNext} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "#f0f0f0",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  audioButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 6,
    marginLeft: 10,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Crossword;
