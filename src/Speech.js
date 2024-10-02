import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import axios from 'axios';

const SpeechCheck = () => {
  const [words, setWords] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [recordings, setRecordings] = useState({});
  // Simulated accuracy for demonstration
  const [accuracy, setAccuracy] = useState({}); 

  useEffect(() => {
    axios.get("https://learnirula.azurewebsites.net/api/")
      .then(response => {
        setWords(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleAudioPress = async (audioPath) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: audioPath });
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const startRecording = async (wordId) => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();
      setCurrentRecording({ wordId, recording });
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!currentRecording) return;
    console.log('Stopping recording..');
    await currentRecording.recording.stopAndUnloadAsync();
    const uri = currentRecording.recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setRecordings({ ...recordings, [currentRecording.wordId]: uri });
    setCurrentRecording(null);
    // Simulate accuracy calculation
    const randomAccuracy = Math.floor(Math.random() * 21) + 80; // Generates a random number between 80 and 100
    setAccuracy({ ...accuracy, [currentRecording.wordId]: "Accuracy: " + randomAccuracy + "%" });
    };
  

  const playRecording = async (wordId) => {
    const uri = recordings[wordId];
    if (!uri) return;
    console.log('Playing recording from:', uri);
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri });
      await soundObject.playAsync();
    } catch (error) {
      console.error("Error playing recording:", error);
    }
  };

  const retryRecording = (wordId) => {
    setRecordings({ ...recordings, [wordId]: null });
    // Reset accuracy for retried word
    setAccuracy({ ...accuracy, [wordId]: undefined });
  };

  const renderItem = ({ item }) => (
    <View style={styles.wordContainer}>
      <Text style={styles.wordEn}>{item.enWord}</Text>
      <Text style={styles.wordTn}>{item.irulaWord}</Text>
      <TouchableOpacity onPress={() => handleAudioPress(item.audioPath)} style={styles.button}>
        <Text style={styles.buttonText}>Play Audio</Text>
      </TouchableOpacity>
      {recordings[item._id] ? (
        <>
          <TouchableOpacity onPress={() => playRecording(item._id)} style={styles.button}>
            <Text style={styles.buttonText}>Play Recording</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => retryRecording(item._id)} style={styles.button}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          {/* Display accuracy if available */}
          {accuracy[item._id] && <Text style={styles.accuracy}>{accuracy[item._id]}</Text>}
        </>
      ) : (
        <>
          {currentRecording && currentRecording.wordId === item._id ? (
            <TouchableOpacity onPress={stopRecording} style={styles.button}>
              <Text style={styles.buttonText}>Stop Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => startRecording(item._id)} style={styles.button}>
              <Text style={styles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );

  return (
    <FlatList
      data={words}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
    />
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    padding: 16,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
  },
  wordEn: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#284387",
  },
  wordTn: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#F05454",
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  accuracy: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});


export default SpeechCheck;
