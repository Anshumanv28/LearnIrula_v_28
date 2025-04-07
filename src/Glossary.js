import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Animated,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { LinearGradient } from 'expo-linear-gradient';

export default function Glossary(props) {
  const [words, setWords] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [scrollbarLetter, setScrollbarLetter] = useState(null);
  const flatListRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [sound, setSound] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadWords();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const loadWords = async () => {
    try {
      const response = await axios.get("https://learnirula.azurewebsites.net/api/");
      const sortedWords = response.data.sort((a, b) =>
        a.enWord.localeCompare(b.enWord, undefined, { ignorePunctuation: true })
      );
      setWords(sortedWords);
      setFilteredData(sortedWords);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const playAudio = async (audioPath, itemId) => {
    try {
      // Stop any currently playing sound
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // If clicking the same item, just stop the sound
      if (currentlyPlaying === itemId) {
        setCurrentlyPlaying(null);
        return;
      }

      // Create and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioPath },
        { shouldPlay: true }
      );

      // Set up playback status update
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setCurrentlyPlaying(null);
          setSound(null);
        }
      });

      // Play the sound
      await newSound.playAsync();
      
      // Update state
      setSound(newSound);
      setCurrentlyPlaying(itemId);

    } catch (error) {
      console.error("Error playing sound:", error);
      setCurrentlyPlaying(null);
      setSound(null);
    }
  };

  const renderItem = ({ item, index }) => {
    const itemNumber = index + 1;
    const isPlaying = currentlyPlaying === item._id;

    return (
      <TouchableOpacity
        onPress={() => playAudio(item.audioPath, item._id)}
        activeOpacity={0.7}
      >
        <Animated.View 
          style={[
            styles.wordContainer,
            { transform: [{ scale: isPlaying ? scaleAnim : 1 }] }
          ]}
        >
          <View style={styles.wordHeader}>
            <View style={styles.wordTitleContainer}>
              <Text style={styles.wordNumber}>{itemNumber}.</Text>
              <Text style={styles.wordEn}>{item.enWord}</Text>
            </View>
            <View style={styles.audioButton}>
              <Ionicons 
                name={isPlaying ? "pause" : "volume-high"} 
                size={24} 
                color={isPlaying ? "#4CAF50" : "#284387"} 
              />
            </View>
          </View>
          
          <Text style={styles.wordTn}>{item.irulaWord}</Text>
          
          <View style={styles.categoryContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.category}>{item.lexicalUnit}</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.category}>{item.category}</Text>
            </View>
          </View>
          
          <Text style={styles.wordMeaning}>{item.enMeaning}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollFraction = contentOffset.y / (contentSize.height - layoutMeasurement.height);
    const index = Math.floor(scrollFraction * filteredData.length);
    const item = filteredData[index];
    if (item) {
      const letter = item.enWord[0].toLowerCase();
      if (letter !== scrollbarLetter) {
        setScrollbarLetter(letter);
        setSelectedLetter(letter);
      }
    }
  };

  const handleLetterPress = (letter) => {
    setSelectedLetter(letter);
    const indexInWords = words.findIndex((item) =>
      item.enWord.toLowerCase().startsWith(letter)
    );
    if (indexInWords !== -1) {
      const item = words[indexInWords];
      const indexInFilteredData = filteredData.findIndex(
        (filteredItem) => filteredItem._id === item._id
      );
      if (indexInFilteredData !== -1) {
        flatListRef.current.scrollToIndex({
          animated: true,
          index: indexInFilteredData,
        });
      }
    }
  };

  const alphabetList = words.reduce((acc, word) => {
    const firstLetter = word.enWord[0].toLowerCase();
    if (!acc.includes(firstLetter)) {
      acc.push(firstLetter);
    }
    return acc;
  }, []);

  const handleSearch = (text) => {
    if (typeof text !== "string") {
      return;
    }

    const filtered = words.filter((item) => {
      return (
        (item.enWord && item.enWord.toLowerCase().includes(text.toLowerCase())) ||
        (item.taWord && item.taWord.toLowerCase().includes(text.toLowerCase()))
      );
    });

    setFilteredData(filtered);
    setSearchTerm(text);
    setIsFocused(true);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setIsFocused(false);
    setFilteredData(words);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#284387', '#1a2f5a']}
        style={styles.background}
      >
        <StatusBar style="light" />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Irula Glossary</Text>
          <Text style={styles.headerSubtitle}>Learn and listen to words</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search words..."
            value={searchTerm}
            onChangeText={handleSearch}
            placeholderTextColor="#666"
          />
          {isFocused && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading words...</Text>
          </View>
        ) : filteredData.length ? (
          <FlatList
            ref={flatListRef}
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            onScroll={handleScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={50} color="#fff" />
            <Text style={styles.emptyText}>No words found</Text>
          </View>
        )}

        <View style={styles.scrollbarContainer}>
          {alphabetList.map((letter, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleLetterPress(letter)}
              style={styles.scrollbarButton}
            >
              <Text style={[
                styles.scrollbarText,
                selectedLetter === letter && styles.scrollbarSelectedText
              ]}>
                {letter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  wordContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  wordTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wordNumber: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  wordEn: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#284387',
    flex: 1,
  },
  wordTn: {
    fontSize: 16,
    color: '#F05454',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  wordMeaning: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollbarContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  scrollbarButton: {
    paddingVertical: 2,
  },
  scrollbarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scrollbarSelectedText: {
    fontSize: 14,
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
});