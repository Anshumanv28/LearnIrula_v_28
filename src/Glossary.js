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
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

export default function Glossary(props) {
  const [words, setWords] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [scrollbarLetter, setScrollbarLetter] = useState(null);
  const flatListRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  //

  useEffect(() => {
    axios
      .get("https://learnirula.azurewebsites.net/api/") //https://learnirula.azurewebsites.net/api/
      .then((response) => {
        const sortedWords = response.data.sort((a, b) =>
          a.enWord.localeCompare(b.enWord, undefined, {
            ignorePunctuation: true,
          })
        );
        setWords(sortedWords);
        setFilteredData(sortedWords);
      })
      .catch((error) => console.error(error));
  }, []);

  const renderItem = ({ item, index }) => {
    const itemNumber = index + 1;
    return (
      <TouchableOpacity
        onPress={async () => {
          const soundObject = new Audio.Sound();
          try {
            await soundObject.loadAsync({
              uri: item.audioPath,
            });

            await soundObject.playAsync();
          } catch (error) {
            console.error("Error playing sound:", error);
          }
        }}
      >
        <View style={styles.wordContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={styles.wordEn}>
              {`${itemNumber}. `}
              {item.enWord}
            </Text>
            <Text style={styles.wordTn}>{item.irulaWord}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={styles.category}>{item.lexicalUnit}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <Text style={styles.wordMeaning}>{item.enMeaning}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;

    const scrollFraction =
      contentOffset.y / (contentSize.height - layoutMeasurement.height);
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
        (item.enWord &&
          item.enWord.toLowerCase().includes(text.toLowerCase())) ||
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
    setFilteredData(words); // set back to the original data
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#284387" />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchTerm}
          onChangeText={handleSearch}
          placeholderTextColor="#284387"
        />
        {isFocused && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close" size={24} color="#284387" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#284387" />
        </TouchableOpacity>
      </View>
      {filteredData.length ? (
        <FlatList
          ref={flatListRef}
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          onScroll={handleScroll}
          initialScrollIndex={props.activeIndex}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
      ) : (
        <View style={styles.flatlistContainer}>
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Please wait...
          </Text>

          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            தயவுசெய்து காத்திருக்கவும்...
          </Text>
        </View>
      )}

      <View style={styles.scrollbarContainer}>
        {alphabetList &&
          alphabetList.map((letter, index) => (
            <Text
              key={index}
              style={[
                styles.scrollbarText,
                selectedLetter === letter && styles.scrollbarSelectedText,
              ]}
              onPress={() => handleLetterPress(letter)}
            >
              {letter.toUpperCase()}
            </Text>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#284387",
  },
  wordContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
    marginRight: 35,
    marginLeft: 20,
    marginVertical: 20,
    borderRadius: 10,
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
  wordMeaning: {
    fontSize: 16,
    color: "black",
  },
  category: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "capitalize",
  },
  scrollbarContainer: {
    position: "absolute",

    top: 0,
    bottom: 0,
    right: 0,
    width: 20,
    backgroundColor: "#284387",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollbarText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#a8a8a8",
    marginVertical: 2,
  },
  scrollbarSelectedText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,

    paddingHorizontal: 10,

    height: 42,
    marginRight: 35,
    marginLeft: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
});
