import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

const EasyQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timer, setTimer] = useState(60);
  const [options, setOptions] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [translateToTamil, setTranslateToTamil] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasBeenAwardedBadge, setHasBeenAwardedBadge] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const fetchData = useCallback(() => {
    console.log("Fetching data from API for Easy Quiz...");
    axios
      .get("https://learnirula.azurewebsites.net/api/") 
      .then((response) => {
        let newData = response.data.sort(() => Math.random() - 0.5);
        setData(newData);
        setLoading(false);
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
      handleSubmit(true); 
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

    const currentOptions = data
      .slice(currentQuestion - 1, currentQuestion + 3)
      .map((item) => ({
        text: translateToTamil ? item.taWord : item.enWord,
        audioPath: item.audioPath,
      }));
    setOptions(shuffleOptions(currentOptions));
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

  const handleQuestionPress = () => {
    playSound(data[currentQuestion - 1].audioPath);
  };

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    playSound(option.audioPath); 
  };

  const handleSubmit = (privileged = false) => {
    if (!isSubmitted) {
      if (selectedOption || privileged) {
        const correctAnswer = data[currentQuestion - 1].enWord; 
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
    <ScrollView
      contentContainerStyle={styles.scrollViewContent}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.quizContainer}>
        {hasBeenAwardedBadge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>
              🏆 Achievement Unlocked: 50 Points!
            </Text>
          </View>
        )}
        <View style={styles.header}>
          <Pressable
            onPress={toggleLanguage}
            style={styles.languageToggleButton}
          >
            <Text style={styles.languageToggleButtonText}>
              {translateToTamil ? "Translate to English" : "Translate to Irula"}
            </Text>
          </Pressable>
          <Text style={styles.pointsText}>Points: {points}</Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.quizHeader}>{`Question ${currentQuestion}/10`}</Text>
        <Text style={styles.timerText}>{`Time left: ${timer}s`}</Text>

        {/* Question Audio Button */}
        <Pressable onPress={handleQuestionPress} style={styles.questionButton}>
          <Text style={styles.questionButtonText}>Play Question Audio</Text>
        </Pressable>

        {options.map((option, index) => (
          <Pressable // Make each option a Pressable to play audio
            key={index}
            onPress={() => handleOptionPress(option)}
            style={[
              styles.optionButton,
              selectedOption === option ? styles.selectedOption : null,
            ]}
          >
            <Text style={styles.optionButtonText}>{option.text}</Text>
          </Pressable>
        ))}

        {!isSubmitted && (
          <Pressable
            onPress={() => handleSubmit(false)}
            style={styles.submitButton}
            disabled={!selectedOption}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </Pressable>
        )}

        {quizCompleted && (
          <View>
            <Text style={styles.finalScore}>Final Score: {points}</Text>
            <Pressable onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  quizContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  languageToggleButton: {
    backgroundColor: "#2196F3", // Blue color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  languageToggleButtonText: {
    fontSize: 16,
    color: "#fff", // White text
    fontWeight: "bold",
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Dark gray text
  },
  progressBarContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0e0", // Light gray background
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 15,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#32CD32", // Green progress bar
    borderRadius: 10,
  },
  quizHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Dark gray text
    marginBottom: 10,
  },
  timerText: {
    fontSize: 18,
    color: "#FF4500", // Orange color for timer
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionButton: {
    backgroundColor: "#007BFF", // Blue color for question button
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
  },
  questionButtonText: {
    fontSize: 18,
    color: "#fff", // White text
    fontWeight: "bold",
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#FF5722", // Orange color for option buttons
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  selectedOption: {
    backgroundColor: "#FF9800", // Darker orange for selected option
  },
  optionButtonText: {
    fontSize: 18,
    color: "#fff", // White text
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#8BC34A", // Light green for submit button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
  },
  submitButtonText: {
    fontSize: 20,
    color: "#fff", // White text
    fontWeight: "bold",
    textAlign: "center",
  },
  badgeContainer: {
    marginBottom: 20,
    backgroundColor: "#FFD700", // Gold color for badge
    padding: 10,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333", // Dark gray text
    textAlign: "center",
  },
  finalScore: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333", // Dark gray text
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#00BCD4", // Cyan color for retry button
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
  },
  retryButtonText: {
    fontSize: 20,
    color: "#fff", // White text
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EasyQuiz;