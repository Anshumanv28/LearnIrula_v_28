import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Audio } from "expo-av";
import * as Progress from "react-native-progress"; // Import the progress bar component

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timer, setTimer] = useState(60);
  const [options, setOptions] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [imageUri, setImageUri] = useState("");
  const [translateToTamil, setTranslateToTamil] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [progress, setProgress] = useState(0); // New state variable for progress
  const [hasBeenAwardedBadge, setHasBeenAwardedBadge] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false); // New state to track quiz completion
  const [difficulty, setDifficulty] = useState(null); // State for difficulty level
 

  // const handleDifficultySelection = (level) => {
  //   if (level === "easy") {
  //     // Show a blank page for easy difficulty
  //     return <View style={styles.blankPage} />;
  //   } else if (level === "medium") {
  //     // Show the medium quiz
  //     setDifficulty(level);
  //     fetchData(); // Fetch data based on difficulty
  //   } else {
  //     alert("Hard difficulty is under construction");
  //   }
  // };
  
  const handleDifficultySelection = (level) => {
      setDifficulty(level); 
  }

  const fetchData = useCallback(() => {
    console.log("Fetching data from API...");
    axios
      .get("https://learnirula.azurewebsites.net/api/")
      .then((response) => {
        let newData = response.data.sort(() => Math.random() - 0.5);
 
        // const currData = newData.filter(ques=>{
        //   return ques.difficulty === difficulty;s
        // })\
        if (difficulty==="easy"){
          newData = newData.map(ques=>{
            const {picturePath, ...rem} = ques;
            return rem;
          })
        }
        setData(newData);
        setLoading(false);
        setImageUri(newData[0]?.picturePath); //where the new image is coming from the API
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [difficulty]);

  useEffect(() => {
    if(difficulty){
      fetchData();
    }
  }, [difficulty]);

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
    // Update progress when the current question changes
    setProgress(currentQuestion / 10); // Assuming there are 10 questions
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
      // End the quiz if more than 10 questions
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
    setImageUri(data[currentQuestion - 1]?.picturePath);
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
    setSelectedOption(option);
    playSound(option.audioPath);
  };

  const handleSubmit = (privilaged = false) => {
    if (!isSubmitted) { 
        
        // Check for correct answer only if an option is selected OR it's a privileged submission (timer ran out)
        if (selectedOption || privilaged) {
            const correctAnswer = translateToTamil ? data[currentQuestion - 1].taWord : data[currentQuestion - 1].enWord;
            if (selectedOption && selectedOption.text === correctAnswer) {
                const newPoints = points + 10;
                setPoints(newPoints);
                if (newPoints >= 50 && !hasBeenAwardedBadge) {
                    setHasBeenAwardedBadge(true);
                }
            }
        } else { // If no option selected and not privileged, do nothing
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
    setDifficulty(null); // Reset difficulty selection
    fetchData(); // Reload data
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

  

  return (
    <View style={styles.container}>
    {!difficulty ? (
      renderDifficultySelection()
    ) :  loading? (
      <Text style={styles.loadingText}>Loading...</Text>
    ) : quizCompleted ? (
      // ... quiz completed rendering
      <View style={styles.quizContainer}>
        <Text style={styles.quizHeader}>Quiz Completed!</Text>
        <Text style={styles.finalScore}>Final Score: {points}</Text>
        <Pressable onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
      ) : (
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
                  {translateToTamil
                    ? "Translate to English"
                    : "Translate to Tamil"}
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

            <Text
              style={styles.quizHeader}
            >{`Question ${currentQuestion}/10`}</Text>
            <Text style={styles.timerText}>{`Time left: ${timer}s`}</Text>
            <Text style={styles.questionText}>
              {translateToTamil
                ? `கேள்வி ${currentQuestion}: படத்தில் என்ன உள்ளது?`
                : questionText}
            </Text>
            {imageUri && 
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.questionImage} />
            </View>
            }
            {options.map((option, index) => (
              <Pressable
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
              <Pressable onPress={()=>handleSubmit(false)} style={styles.submitButton} disabled={!selectedOption }>
                <Text style={styles.submitButtonText}>Submit</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      )}
    </View>

    
  );
};

const styles = StyleSheet.create({
  
  blankPage: {
    flex: 1,
    backgroundColor: "#fff", // Set background color to white (or any desired color)
  },
  container: {
    display:"flex",
    height:"100%",
    flex:1,
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
    display:"flex",
    flexDirection:"column",
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
    width: 150, //change the size of the button
    paddingVertical: 15,
    borderRadius: 10,
    width:"2rem",
    //justifyContent: 'center', // Add this to center text vertically
  },
  difficultyButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: 'center',     // Add this to center text horizontally
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
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  languageToggleButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  pointsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  progressBarContainer: {
    height: 20,
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 15,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#32CD32",
    borderRadius: 10,
  },
  quizHeader: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  timerText: {
    fontSize: 18,
    color: "#FF4500",
    fontWeight: "bold",
    marginBottom: 10,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  questionImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  optionButton: {
    backgroundColor: "#FF5722",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  selectedOption: {
    backgroundColor: "#FF9800",
  },
  optionButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#8BC34A",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: "100%",
  },
  submitButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  badgeContainer: {
    marginBottom: 20,
    backgroundColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  finalScore: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#00BCD4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
  },
  retryButtonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Quiz;