import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import { Audio } from 'expo-av';

export default function MLScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    fetchData();
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

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

  const playSound = async (audioPath) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioPath }
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
      Alert.alert("Error", "Unable to play sound");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("https://learnirula.azurewebsites.net/api/");
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.picturePath }} style={styles.image} />
            <Text style={styles.text}>Lexical Unit: {item.lexicalUnit}</Text>
            <Text style={styles.text}>English: {item.enWord}</Text>
            <Text style={styles.text}>Irula: {item.irulaWord}</Text>
            <Text style={styles.text}>Tamil: {item.taWord}</Text>
            <Text style={styles.text}>Category: {item.category}</Text>
            <Text style={styles.text}>Grammar: {item.grammaticalInfo}</Text>
            <Text style={styles.text}>English Meaning: {item.enMeaning}</Text>
            <Text style={styles.text}>Tamil Meaning: {item.taMeaning}</Text>
            <TouchableOpacity 
              style={styles.soundButton}
              onPress={() => playSound(item.audioPath)}
            >
              <Text style={styles.soundButtonText}>Play Sound</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  soundButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  soundButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});