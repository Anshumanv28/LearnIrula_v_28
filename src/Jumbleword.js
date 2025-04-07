import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

export default function WordScramble() {
  const [state, setState] = useState({
    data: [],
    currentIndex: 0,
    scrambledWord: "",
    userInput: "",
    loading: true,
    language: "en",
    sound: null,
    guessedCorrectly: false,
    correctWordRevealed: false,
    triesLeft: 3,
    hintModalVisible: false,
  });

  useEffect(() => {
    const setup = async () => {
      await setupAudio();
      await fetchData();
    };
    setup();

    return () => {
      if (state.sound) {
        state.sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (state.data.length > 0) {
      prepareNextWord();
    }
  }, [state.currentIndex, state.data, state.language]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error("Error setting up audio:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("https://learnirula.azurewebsites.net/api/");
      setState((prev) => ({
        ...prev,
        data: shuffleArray(response.data),
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const shuffleWord = (word) => {
    let shuffled = word;
    while (shuffled === word) {
      const letters = word.split("");
      for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
      }
      shuffled = letters.join("");
    }
    return shuffled;
  };

  const prepareNextWord = () => {
    const currentWord = getCurrentWord();
    const jumbledWord = shuffleWord(currentWord);
    setState((prev) => ({
      ...prev,
      scrambledWord: jumbledWord,
      triesLeft: 3,
      guessedCorrectly: false,
      correctWordRevealed: false,
      userInput: "",
    }));
  };

  const getCurrentWord = () => {
    switch (state.language) {
      case "en":
        return state.data[state.currentIndex]?.enWord || "";
      case "irula":
        return state.data[state.currentIndex]?.irulaWord || "";
      case "ta":
        return state.data[state.currentIndex]?.taWord || "";
      default:
        return state.data[state.currentIndex]?.enWord || "";
    }
  };


  const getHint = () => ({
    en: state.data[state.currentIndex]?.enMeaning || "No hint available",
    ta: state.data[state.currentIndex]?.taMeaning || "No hint available",
  });

  const playSound = async () => {
    try {
      if (state.sound) {
        await state.sound.unloadAsync();
      }

      const soundUri = state.data[state.currentIndex]?.audioPath;
      if (soundUri) {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: soundUri },
          { shouldPlay: true }
        );
        setState((prev) => ({ ...prev, sound: newSound }));
      } else {
        Alert.alert("No audio available for this word.");
      }
    } catch (error) {
      console.error("Error playing sound:", error);
      Alert.alert("Error", "Unable to play sound.");
    }
  };

  const handleSubmit = () => {
    const correctWord = getCurrentWord().toLowerCase();

    if (state.userInput.trim().toLowerCase() === correctWord) {
      setState((prev) => ({
        ...prev,
        guessedCorrectly: true,
        correctWordRevealed: false,
      }));
      Alert.alert("🎉 Correct!", "You guessed the right word.");
    } else {
      const triesLeft = state.triesLeft - 1;
      if (triesLeft === 0) {
        setState((prev) => ({
          ...prev,
          correctWordRevealed: true,
          triesLeft: 3,
        }));
        Alert.alert("😞 Out of Tries", `The correct word was "${correctWord}". Practice by writing it.`);
      } else {
        setState((prev) => ({ ...prev, triesLeft }));
        Alert.alert("😞 Try Again", `You have ${triesLeft} tries left.`);
      }
    }
  };

  const handleNext = () => {
    setState((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % state.data.length,
    }));
  };

  if (state.loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  const currentItem = state.data[state.currentIndex];

  return (
    <LinearGradient colors={["#4c669f", "#3b5998", "#192f6a"]} style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: currentItem.picturePath }} style={styles.image} />
        <Text style={styles.scrambledWord}>{state.scrambledWord}</Text>

        <TouchableOpacity
          style={styles.hintButton}
          onPress={() => setState((prev) => ({ ...prev, hintModalVisible: true }))}
        >
          <Text style={styles.hintButtonText}>💡</Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={state.hintModalVisible}
          onRequestClose={() => setState((prev) => ({ ...prev, hintModalVisible: false }))}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1} 
            onPress={() => setState((prev) => ({ ...prev, hintModalVisible: false }))}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Hints</Text>
              <Text style={styles.hintText}>English: {currentItem.enMeaning}</Text>
              <Text style={styles.hintText}>Tamil: {currentItem.taMeaning}</Text>
            </View>
          </TouchableOpacity>
        </Modal>

        {state.correctWordRevealed && (
          <Text style={styles.correctWord}>
            Correct Word: {getCurrentWord()}
          </Text>
        )}
          
        <TextInput
          style={styles.input}
          placeholder="Type your guess here"
          placeholderTextColor="#bbb"
          value={state.userInput}
          onChangeText={(text) => setState((prev) => ({ ...prev, userInput: text }))}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>

        {state.guessedCorrectly && (
          <View style={styles.correctGuessContainer}>
            <Text style={styles.correctGuessText}>Tamil: {currentItem.taWord}</Text>
            <Text style={styles.correctGuessText}>Irula: {currentItem.irulaWord}</Text>
            <TouchableOpacity style={styles.playSoundButton} onPress={playSound}>
              <Text style={styles.buttonText}>Play Sound</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  scrambledWord: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  correctWord: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginVertical: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#4c669f",
    borderRadius: 10,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  correctGuessContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  correctGuessText: {
    fontSize: 16,
    marginVertical: 5,
  },
  playSoundButton: {
    backgroundColor: "#4c669f",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  hintButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4c669f',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintButtonText: {
    fontSize: 20,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
