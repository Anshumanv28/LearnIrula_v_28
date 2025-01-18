import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  RefreshControl,
  Keyboard,
  Dimensions,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [numItemsToRender, setNumItemsToRender] = useState(35);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchText, setSearchText] = useState("");
  const searchInput = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = useCallback(() => {
    // Check internet connection
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        // Fetch data from API
        const startTime1 = Date.now();
        const startTime = performance.now();
        axios
          .get("https://learnirula.azurewebsites.net/api/") // Replace with your API endpoint
          .then((response) => {
            // Cache data using AsyncStorage
            const data = response.data;
            AsyncStorage.setItem("data", JSON.stringify(data));
            const shuffledData = data.sort(() => Math.random() - 0.5);
            setData(shuffledData);
            setFilteredData(data);
            setRefreshing(false);
            const endTime1 = Date.now();
            console.log(`API took ${endTime1 - startTime1} ms to render`);
            const endTime = performance.now();
            console.log(`API took ${endTime - startTime} ms to render`);
          })
          .catch((error) => {
            console.error(error);
            setRefreshing(false);
          });
      } else {
        // Get cached data from AsyncStorage
        AsyncStorage.getItem("data")
          .then((cachedData) => {
            if (cachedData !== null) {
              const data = JSON.parse(cachedData);
              const shuffledData = data.sort(() => Math.random() - 0.5);
              setData(shuffledData);
              setFilteredData(data);
            }
            setRefreshing(false);
          })
          .catch((error) => {
            console.error(error);
            setRefreshing(false);
          });
      }
    });
  }, []);

  const handleSearch = (text) => {
    console.log("handleSearch function started");
    if (typeof text !== "string") {
      console.log("Invalid text type");
      return;
    }
    const startTime = performance.now();
    const filtered = data.filter((item) => {
      return (
        (item.enWord &&
          item.enWord.toLowerCase().startsWith(text.toLowerCase())) ||
        (item.taWord &&
          item.taWord.toLowerCase().startsWith(text.toLowerCase()))
      );
    });
    const endTime = performance.now();
    console.log(
      `handleSearch function took ${
        endTime - startTime
      } milliseconds to execute`
    );
    setFilteredData(filtered);
    setSearchText(text);
    setIsFocused(true);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setIsFocused(false);
    setFilteredData(data);
    Keyboard.dismiss();
  };

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <Image source={{ uri: item.picturePath }} style={styles.itemImage} />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTitle}>{item.enWord}</Text>
          <Text style={styles.itemSubtitle}>{item.taWord}</Text>
          <Text style={styles.itemLexicalUnit}>{item.lexicalUnit}</Text>
          <Text style={styles.itemMeaning}>{item.taMeaning}</Text>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    handleClearSearch();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.MainContainer}>
        <StatusBar style="light" backgroundColor="#284387" />
        <View style={styles.searchContainer}>
          <TextInput
            ref={searchInput}
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search..."
            placeholderTextColor="#284387"
          />
          {isFocused && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close" size={24} color="#284387" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleSearch(searchText)}>
            <Ionicons name="search" size={24} color="#284387" />
          </TouchableOpacity>
        </View>
        {filteredData.length ? (
          <FlatList
            data={filteredData.slice(0, numItemsToRender)}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            onEndReached={() => setNumItemsToRender(numItemsToRender + 35)}
            onEndReachedThreshold={0.1}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["green", "#284387"]}
                tintColor="#FFF"
                title="Loading..."
                titleColor="#FFF"
              />
            }
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Please wait...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#284387",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    margin: 16,
    backgroundColor: "white",
    borderRadius: 20,
  },
  itemImage: {
    width: 95,
    height: 78,
    borderRadius: 8,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 15,
    color: "#284387",
    fontWeight: "bold",
  },
  itemSubtitle: {
    fontSize: 12,
    color: "green",
  },
  itemLexicalUnit: {
    fontSize: 10,
    color: "red",
  },
  itemMeaning: {
    fontSize: 10,
    color: "green",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
