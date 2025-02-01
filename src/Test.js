import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

export default function EnglishIrulaGame() {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    fetchCardsData();
  }, []);

  const fetchCardsData = async () => {
    try {
      const response = await axios.get('https://learnirula.azurewebsites.net/api/');
      const data = response.data;
      const selectedPairs = data.slice(0, 6); // Select 6 words
      const cardPairs = selectedPairs.map(item => ({
        id: `${item._id}-english`,
        text: item.enWord,
        type: 'english',
        matchId: item._id,
      })).concat(
        selectedPairs.map(item => ({
          id: `${item._id}-irula`,
          text: item.irulaWord,
          type: 'irula',
          matchId: item._id,
        }))
      );

      setCards(shuffleArray(cardPairs));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
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
  };

  const checkForMatch = ([firstIndex, secondIndex]) => {
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
      setMatchedCards((prev) => [...prev, firstIndex, secondIndex]);
    }

    setFlippedCards([]);
    setIsChecking(false);
  };

  const renderCard = ({ item, index }) => {
    const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);

    return (
      <TouchableOpacity
        style={[styles.card, isFlipped ? styles.cardFlipped : styles.cardHidden]}
        onPress={() => handleCardFlip(index)}
        disabled={isFlipped || isChecking}
      >
        <Text style={styles.cardText}>{isFlipped ? item.text : '????'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>English to Irula Matching</Text>
      <FlatList
        numColumns={3}
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        style={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  grid: {
    flex: 1,
    width: '90%',
  },
  card: {
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 5,
  },
  cardHidden: {
    backgroundColor: '#ddd',
  },
  cardFlipped: {
    backgroundColor: '#4caf50',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
