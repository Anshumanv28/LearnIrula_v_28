// src/quiz/MediumQuiz.js

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { Audio } from "expo-av";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
//import * as Progress from "react-native-progress";

const MediumQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timer, setTimer] = useState(60);
  const [options, setOptions] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [imageUri, setImageUri] = useState(""); // To store the image URI
  const [translateToTamil, setTranslateToTamil] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasBeenAwardedBadge, setHasBeenAwardedBadge] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);

  const fetchData = useCallback(() => {
    console.log("Fetching data from API for Medium Quiz...");
    axios
      .get("https://learnirula.azurewebsites.net/api/")
      .then((response) => {
        let newData = response.data.sort(() => Math.random() - 0.5);
        setData(newData);
        setLoading(false);
        setImageUri(newData[0]?.picturePath); // Set the image URI
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !quizCompleted) {
      displayQuestionAndOptions();
    }
  }, [currentQuestion, data, translateToTamil, quizCompleted]);

  useEffect(() => {
    if (timer === 0) {
      handleSubmit(true); // Automatically submit when timer expires
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setProgress(currentQuestion / 10);
  }, [currentQuestion]);

  const shuffleOptions = (options) => {
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const displayQuestionAndOptions = () => {
    if (currentQuestion > 10) {
      setQuizCompleted(true);
      return;
    }

    const question = `Question ${currentQuestion}: What is in the image?`;
    setQuestionText(question);

    const currentOptions = data
      .slice(currentQuestion - 1, currentQuestion + 3)
      .map((item) => ({
        text: translateToTamil ? item.taWord : item.enWord,
        audioPath: item.audioPath,
      }));
    setOptions(shuffleOptions(currentOptions));
    setImageUri(data[currentQuestion - 1]?.picturePath); // Update image URI
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  const playSound = async (audioPath) => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioPath },
      { shouldPlay: true }
    );
    await sound.playAsync();
  };

  const handleOptionPress = (option) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedOption(option);
    playSound(option.audioPath);
  };

  const handleSubmit = (privileged = false) => {
    if (!isSubmitted) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      if (selectedOption || privileged) {
        const correctAnswer = translateToTamil
          ? data[currentQuestion - 1].taWord
          : data[currentQuestion - 1].enWord;
        if (selectedOption && selectedOption.text === correctAnswer) {
          const newPoints = points + 10;
          setPoints(newPoints);
          if (newPoints >= 50 && !hasBeenAwardedBadge) {
            setHasBeenAwardedBadge(true);
          }
        }
      } else {
        return;
      }

      setIsSubmitted(true);

      setTimeout(() => {
        if (currentQuestion < 10) {
          setCurrentQuestion(currentQuestion + 1);
          setIsSubmitted(false);
          setSelectedOption(null);
          setTimer(60);
        } else {
          setQuizCompleted(true);
        }
      }, 500);
    }
  };

  const toggleLanguage = () => {
    setTranslateToTamil(!translateToTamil);
  };

  const handleRetry = () => {
    setCurrentQuestion(1);
    setPoints(0);
    setTimer(60);
    setProgress(0);
    setIsSubmitted(false);
    setQuizCompleted(false);
    fetchData();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#f7f7f7', '#e8e8e8']}
        style={styles.background}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.quizContainer, { opacity: fadeAnim }]}>
            {hasBeenAwardedBadge && (
              <View style={styles.badgeContainer}>
                <Ionicons name="trophy" size={24} color="#FFD700" />
                <Text style={styles.badgeText}>
                  Achievement Unlocked: 50 Points!
                </Text>
              </View>
            )}

            <View style={styles.header}>
              <Pressable
                onPress={toggleLanguage}
                style={styles.languageToggleButton}
              >
                <LinearGradient
                  colors={['#2196F3', '#1976D2']}
                  style={styles.gradient}
                >
                  <Text style={styles.languageToggleButtonText}>
                    {translateToTamil ? "Translate to English" : "Translate to Tamil"}
                  </Text>
                </LinearGradient>
              </Pressable>
              <View style={styles.pointsContainer}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.pointsText}>Points: {points}</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>

            <View style={styles.questionHeader}>
              <Text style={styles.quizHeader}>{`Question ${currentQuestion}/10`}</Text>
              <View style={styles.timerContainer}>
                <Ionicons name="time" size={20} color="#FF4500" />
                <Text style={styles.timerText}>{`${timer}s`}</Text>
              </View>
            </View>

            <Text style={styles.questionText}>
              {translateToTamil
                ? `கேள்வி ${currentQuestion}: படத்தில் என்ன உள்ளது?`
                : questionText}
            </Text>

            {imageUri && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: imageUri }} 
                  style={styles.questionImage}
                />
              </View>
            )}

            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <Animated.View 
                  key={index}
                  style={{ transform: [{ scale: scaleAnim }] }}
                >
                  <Pressable
                    onPress={() => handleOptionPress(option)}
                    style={[
                      styles.optionButton,
                      selectedOption === option && styles.selectedOption,
                    ]}
                  >
                    <LinearGradient
                      colors={selectedOption === option 
                        ? ['#FF9800', '#F57C00']
                        : ['#FF5722', '#E64A19']}
                      style={styles.gradient}
                    >
                      <Text style={styles.optionButtonText}>{option.text}</Text>
                    </LinearGradient>
                  </Pressable>
                </Animated.View>
              ))}
            </View>

            {!isSubmitted && (
              <Pressable
                onPress={() => handleSubmit(false)}
                style={styles.submitButton}
                disabled={!selectedOption}
              >
                <LinearGradient
                  colors={['#8BC34A', '#689F38']}
                  style={styles.gradient}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </LinearGradient>
              </Pressable>
            )}

            {quizCompleted && (
              <View style={styles.completionContainer}>
                <Text style={styles.finalScore}>Final Score: {points}</Text>
                <Pressable onPress={handleRetry} style={styles.retryButton}>
                  <LinearGradient
                    colors={['#00BCD4', '#0097A7']}
                    style={styles.gradient}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            )}
          </Animated.View>
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
  scrollViewContent: {
    flexGrow: 1,
    padding: 20,
  },
  quizContainer: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  languageToggleButton: {
    borderRadius: 25,
    overflow: "hidden",
    width: 180,
    height: 40,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  languageToggleButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 5,
  },
  pointsContainer: {
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
  pointsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
  },
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 20,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  quizHeader: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
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
    color: "#FF4500",
    fontWeight: "600",
    marginLeft: 5,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  questionImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  optionsContainer: {
    width: "100%",
    gap: 15,
  },
  optionButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  selectedOption: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  optionButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  completionContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  finalScore: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  retryButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  retryButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
});

export default MediumQuiz;