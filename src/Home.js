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
          .get("https://learnirula.azurewebsites.net/api/") //https://learnirula.azurewebsites.net/api/
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
        style={{
          flex: 1,
          flexDirection: "row",
          padding: 16,
          alignItems: "center",
          margin: 16,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 15,
        }}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <Image
          source={{ uri: item.picturePath }}
          style={{ width: 95, height: 78, borderRadius: 8 }}
        />

        <View style={{ flex: 1, justifyContent: "center", marginLeft: 10 }}>
          <Text
            style={{
              fontSize: 15,
              color: "#284387",
              marginBottom: 7,
              fontWeight: "bold",
            }}
          >
            {item.enWord}
          </Text>
          <Text style={{ fontSize: 12, color: "green", marginBottom: 7 }}>
            {item.taWord}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 10, color: "red", marginBottom: 7 }}
          >
            {item.lexicalUnit}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ fontSize: 10, color: "green", marginBottom: 7 }}
          >
            {item.taMeaning}
          </Text>
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
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={24} color="#284387" />
          </TouchableOpacity>
        </View>
        {filteredData.length ? (
          <View style={styles.flatlistContainer}>
            <FlatList
              data={filteredData.slice(0, numItemsToRender)}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              scrollIndicatorInsets={{ color: "white" }}
              onEndReached={() => {
                setNumItemsToRender(numItemsToRender + 35);
              }}
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
          </View>
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
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          backdropOpacity={0.3}
          propagateSwipe={true}
        >
          <View style={{ flex: 1, backgroundColor: "#000000aa" }}>
            <View style={{ flex: 1, backgroundColor: "transparent" }} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={70} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContainer}>
              <View style={styles.titleContainer}>
                <View style={styles.wordtileContainer}>
                  <Text
                    style={{
                      color: "green",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {selectedItem ? selectedItem.taWord : ""}
                  </Text>
                </View>

                <View style={styles.wordtileContainer}>
                  <Text
                    style={{
                      color: "#284387",
                      fontSize: 16,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {selectedItem ? selectedItem.enWord : ""}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-between",

                  marginTop: 23,

                  height: Dimensions.get("window").height * 0.5,
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",

                    width: "48%",
                  }}
                >
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text
                        style={{
                          color: "#284387",
                          fontSize: 14,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {selectedItem ? selectedItem.grammaticalInfo : ""}
                      </Text>
                    </ScrollView>
                  </View>

                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text
                        style={{
                          color: "green",
                          fontSize: 14,
                        }}
                      >
                        {selectedItem ? selectedItem.taMeaning : ""}
                      </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text
                        style={{
                          color: "#284387",
                          fontSize: 14,
                        }}
                      >
                        {selectedItem ? selectedItem.enMeaning : ""}
                      </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text
                        style={{
                          color: "red",
                          fontSize: 16,

                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {selectedItem ? selectedItem.irulaWord : ""}
                      </Text>
                    </ScrollView>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",

                    width: "48%",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text
                        style={{
                          color: "green",
                          fontSize: 14,
                          textTransform: "capitalize",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {selectedItem ? selectedItem.category : ""}
                      </Text>
                    </ScrollView>
                  </View>
                  <View
                    style={{
                      width: 128,
                      height: 238,
                      borderRadius: 8,
                    }}
                  >
                    <Image
                      style={{ width: 128, height: 238, borderRadius: 8 }}
                      source={{
                        uri: selectedItem ? selectedItem.picturePath : "",
                      }}
                    />
                  </View>

                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text
                        style={{
                          color: "red",
                          fontSize: 14,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {selectedItem ? selectedItem.lexicalUnit : ""}
                      </Text>
                    </ScrollView>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={{
                  flex: 1,
                  marginTop: 20,
                  width: "100%",
                  backgroundColor: "#4B639D",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 10,
                }}
                onPress={async () => {
                  const soundObject = new Audio.Sound();
                  try {
                    await soundObject.loadAsync({
                      uri: selectedItem ? selectedItem.audioPath : "",
                    });
                    await soundObject.playAsync();
                  } catch (error) {
                    console.error("Error playing sound:", error);
                  }
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="volume-high-sharp" size={24} color="white" />
                  <Text
                    style={{
                      fontSize: 24,
                      color: "white",
                      marginLeft: 10,
                    }}
                  >
                    Hear this word
                  </Text>
                </View>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#284387",
  },

  button: {
    width: "80%",
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: "#DD2C00",
    borderRadius: 3,
    marginTop: 20,
  },

  text: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    padding: 5,
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
  flatlistContainer: {
    flex: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    margin: 24,
  },
  definitionContainer: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 8,
    padding: 5,
    width: "100%",

    maxHeight: Dimensions.get("window").height * 0.15,

    backgroundColor: "#FFF",
  },
  wordtileContainer: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 8,
    padding: 5,
    width: "48%",
    
    backgroundColor: "#FFF",
  },
  modalContainer: {
    height: Dimensions.get("window").height * 0.65,

    backgroundColor: "#284387",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
  },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35,
  },
});
