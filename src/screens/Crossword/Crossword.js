import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Animated,
  SafeAreaView,
} from "react-native";
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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
      setScore(score + 100);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
      Alert.alert("Success!", "All answers are correct! You can now play the audio for each word.");
    } else {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      Alert.alert("Try Again", "Some answers are incorrect.");
    }
  };

  const handleNext = () => {
    if (currentIndex < crosswords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(300);
    } else {
      Alert.alert("End of Crosswords", "You have reached the end of the crosswords.");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimeLeft(300);
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
      const match = word.match(/^(\d+(\.\d+)?)/);
      if (match) {
        const key = match[2] ? `(${match[1]})` : match[1];
        return `${direction}-${key}`;
      }
      return `${direction}-${word.split(' ')[0]}`;
    };

    const audioKey = getAudioKey(word, direction);
    const audioUrl = audioLinks[audioKey];

    return (
      <TouchableOpacity
        style={styles.audioButton}
        onPress={() => audioUrl && playAudio(audioUrl)}
        disabled={!isCompleted || !audioUrl}
      >
        <Ionicons name="volume-high" size={20} color="white" />
        <Text style={styles.audioButtonText}>Play</Text>
      </TouchableOpacity>
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f7f7f7', '#e8e8e8']}
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View style={styles.scoreContainer}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>
            <View style={styles.timerContainer}>
              <Ionicons name="time" size={24} color="#FF4500" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Irula Crossword</Text>
            <Text style={styles.subtitle}>Puzzle {currentIndex + 1} of {crosswords.length}</Text>
          </View>

          <Animated.View style={[styles.gridContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Grid
              grid={selectedCrossword.grid}
              inputs={inputs}
              onChange={handleChange}
              correctAnswers={selectedCrossword.correctAnswers}
            />
          </Animated.View>

          <Animated.View style={[styles.successContainer, { opacity: fadeAnim }]}>
            <Text style={styles.successText}>Correct! +100 points</Text>
          </Animated.View>

          <View style={styles.hintContainer}>
            <HintSection hints={hints} AudioButton={AudioButton} isCompleted={isCompleted} />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
              onPress={handlePrevious}
              disabled={currentIndex === 0}
            >
              <LinearGradient
                colors={currentIndex === 0 ? ['#cccccc', '#999999'] : ['#2196F3', '#1976D2']}
                style={styles.gradient}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.buttonText}>Previous</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={onSubmit}
            >
              <LinearGradient
                colors={['#4CAF50', '#388E3C']}
                style={styles.gradient}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.buttonText}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, currentIndex === crosswords.length - 1 && styles.disabledButton]}
              onPress={handleNext}
              disabled={currentIndex === crosswords.length - 1}
            >
              <LinearGradient
                colors={currentIndex === crosswords.length - 1 ? ['#cccccc', '#999999'] : ['#2196F3', '#1976D2']}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>Next</Text>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  container: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF4500",
    marginLeft: 5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  gridContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  successContainer: {
    position: "absolute",
    top: 100,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    alignSelf: 'center',
  },
  successText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  hintContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    width: '30%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  submitButton: {
    width: '30%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  audioButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginLeft: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  audioButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default Crossword;
