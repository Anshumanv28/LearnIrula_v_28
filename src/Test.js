import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, Alert } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

export default function EnglishIrulaGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [level, setLevel] = useState(1);
  const [allWords, setAllWords] = useState([]);
  const [sound, setSound] = useState();
  const [loading, setLoading] = useState(true);
  
  const wordsPerLevel = 6; // Number of word pairs per level
  const maxLevel = 5; // Maximum number of levels

  // Fetch all words once when component mounts
  useEffect(() => {
    fetchAllWords();
  }, []);

  // Set up cards whenever level changes or we get new words
  useEffect(() => {
    if (allWords.length > 0) {
      setupCardsForCurrentLevel();
    }
  }, [level, allWords]);

  // Check for game completion
  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length && matchedCards.length > 0) {
      setGameCompleted(true);
    }
  }, [matchedCards, cards]);

  // Clean up sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading sound in cleanup');
          try {
            sound.unloadAsync();
          } catch (error) {
            console.log('Error in sound cleanup:', error);
          }
        }
      : undefined;
  }, [sound]);

  const fetchAllWords = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://learnirula.azurewebsites.net/api/');
      console.log('API Response:', JSON.stringify(response.data[0])); // Log full structure of first item
      setAllWords(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching words data:', error);
      Alert.alert('Error', 'Failed to load words. Please try again.');
      setLoading(false);
    }
  };

  // Get audio URL from the API response
  const getAudioUrl = (item) => {
    // Check if item has the direct audioPath property
    if (item.audioPath) {
      console.log('Using audioPath:', item.audioPath);
      return item.audioPath;
    }
    
    // Check all other possible audio URL fields
    if (item.audioUrl) return item.audioUrl;
    if (item.audio) return item.audio;
    if (item.sound) return item.sound;
    if (item.soundUrl) return item.soundUrl;
    if (item.irulaAudio) return item.irulaAudio;
    
    // Log when no audio URL is found
    console.log('No audio URL found for item:', JSON.stringify(item));
    return null;
  };

  const setupCardsForCurrentLevel = () => {
    // Calculate start index based on level to ensure different words each level
    const startIndex = (level - 1) * wordsPerLevel;
    
    // Check if we have enough words for this level
    if (startIndex >= allWords.length) {
      Alert.alert('Game Complete', 'You have completed all available levels!');
      setLevel(1); // Reset to level 1
      return;
    }
    
    // Select words for this level
    const endIndex = Math.min(startIndex + wordsPerLevel, allWords.length);
    const selectedWords = allWords.slice(startIndex, endIndex);
    
    // Create card pairs (English and Irula)
    const cardPairs = selectedWords.flatMap(item => [
      {
        id: `${item._id}-english`,
        text: item.enWord,
        type: 'english',
        matchId: item._id,
        audioPath: item.audioPath, // Use the correct property name
        originalItem: item // Store the original item for fallback
      },
      {
        id: `${item._id}-irula`,
        text: item.irulaWord,
        type: 'irula',
        matchId: item._id,
        audioPath: item.audioPath, // Use the correct property name
        originalItem: item // Store the original item for fallback
      }
    ]);

    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setMatchedCards([]);
    setGameCompleted(false);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleCardFlip = (index) => {
    if (isChecking || flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setIsChecking(true);
      setTimeout(() => checkForMatch(newFlippedCards), 1000);
    }

    // Trigger animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      animation.setValue(0);
    });
  };

  const checkForMatch = ([firstIndex, secondIndex]) => {
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
      setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
      setScore((prev) => prev + 10);
    }

    setFlippedCards([]);
    setIsChecking(false);
  };

  const playSound = async (audioUrl) => {
    if (!audioUrl) {
      console.log('No audio URL available');
      Alert.alert('Audio Unavailable', 'No audio available for this word.');
      return;
    }

    try {
      console.log('Attempting to play audio from:', audioUrl);
      
      // Stop any existing sound
      if (sound) {
        try {
          await sound.unloadAsync();
        } catch (e) {
          console.log('Error unloading previous sound:', e);
        }
      }
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await newSound.unloadAsync();
          await newSound.releaseAsync();
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error.message);
      Alert.alert('Audio Error', 'Could not play audio. Please try again later.');
    }
  };

  const handleCardPress = (index) => {
    // If the card is already matched, play the audio
    if (matchedCards.includes(index)) {
      const card = cards[index];
      const audioUrl = card.audioPath || getAudioUrl(card.originalItem);
      
      if (audioUrl) {
        playSound(audioUrl);
      } else {
        Alert.alert('Audio Unavailable', 'No audio available for this word.');
        // Implement Text-to-Speech fallback here if desired
      }
    } else {
      // Otherwise, handle normal card flip
      handleCardFlip(index);
    }
  };

  const goToNextLevel = () => {
    if (level < maxLevel) {
      setLevel(prev => prev + 1);
    } else {
      // If at max level, restart from level 1 with a different set of words
      Alert.alert('Congratulations!', 'You completed all levels! Starting over with new words.');
      setLevel(1);
      // Optionally shuffle all words to ensure a different experience
      setAllWords(shuffleArray(allWords));
    }
    setScore(prev => prev + 20); // Bonus for completing the level
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    if (allWords.length > 0) {
      setupCardsForCurrentLevel();
    } else {
      fetchAllWords();
    }
  };

  const renderCard = ({ item, index }) => {
    const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
    const isMatched = matchedCards.includes(index);
    const rotateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isFlipped ? styles.cardFlipped : styles.cardHidden,
          isMatched && styles.cardMatched
        ]}
        onPress={() => handleCardPress(index)}
        disabled={flippedCards.includes(index) && !isMatched}
      >
        <Animated.View style={{ transform: [{ rotateY }] }}>
          <Text style={[
            styles.cardText,
            isMatched && styles.cardMatchedText
          ]}>
            {isFlipped ? item.text : ' '}
          </Text>
          {isMatched && (
            <Text style={styles.listenText}>Tap to listen</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading words...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Match the Words Tiles</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.levelText}>Level: {level}/{maxLevel}</Text>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
      
      <FlatList
        numColumns={3}
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        style={styles.grid}
        contentContainerStyle={styles.gridContent}
      />
      
      {gameCompleted && (
        <View style={styles.completionContainer}>
          <Text style={styles.completionText}>Level Complete! 🎉</Text>
          <Text style={styles.scoreText}>Current Score: {score}</Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.nextButton]} 
            onPress={goToNextLevel}
          >
            <Text style={styles.buttonText}>Next Level</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.resetButton]} 
            onPress={resetGame}
          >
            <Text style={styles.buttonText}>Restart Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    fontSize: 20,
    color: '#3498db',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    color: '#2c3e50',
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  grid: {
    width: '100%',
  },
  gridContent: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHidden: {
    backgroundColor: '#3498db',
  },
  cardFlipped: {
    backgroundColor: '#fff',
  },
  cardMatched: {
    backgroundColor: '#4CAF50',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    padding: 6,
  },
  cardMatchedText: {
    color: '#ffffff',
  },
  listenText: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 4,
  },
  completionContainer: {
    position: 'absolute',
    top: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
    width: '80%',
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    width: '80%',
    alignItems: 'center',
    marginTop: 10,
  },
  nextButton: {
    backgroundColor: '#3498db',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});