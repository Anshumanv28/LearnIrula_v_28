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
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

export default function HomeScreen() {
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
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        axios
          .get("https://learnirula.azurewebsites.net/api/")
          .then((response) => {
            const data = response.data;
            AsyncStorage.setItem("data", JSON.stringify(data));
            const shuffledData = data.sort(() => Math.random() - 0.5);
            setData(shuffledData);
            setFilteredData(data);
            setRefreshing(false);
          })
          .catch((error) => {
            console.error(error);
            setRefreshing(false);
          });
      } else {
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
    const filtered = data.filter((item) => {
      return (
        (item.enWord && item.enWord.toLowerCase().startsWith(text.toLowerCase())) ||
        (item.taWord && item.taWord.toLowerCase().startsWith(text.toLowerCase()))
      );
    });
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
            <View style={styles.modalCloseButton}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle-outline" size={70} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContainer}>
              <View style={styles.titleContainer}>
                <View style={styles.wordtileContainer}>
                  <Text style={styles.wordTileText}>
                    {selectedItem ? selectedItem.taWord : ""}
                  </Text>
                </View>
                <View style={styles.wordtileContainer}>
                  <Text style={styles.wordTileText}>
                    {selectedItem ? selectedItem.enWord : ""}
                  </Text>
                </View>
              </View>
              <View style={styles.modalContent}>
                <View style={styles.modalColumn}>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text style={styles.definitionText}>
                        {selectedItem ? selectedItem.grammaticalInfo : ""}
                      </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text style={styles.definitionText}>
                        {selectedItem ? selectedItem.taMeaning : ""}
                      </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text style={styles.definitionText}>
                        {selectedItem ? selectedItem.enMeaning : ""}
                      </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text style={styles.definitionText}>
                        {selectedItem ? selectedItem.irulaWord : ""}
                      </Text>
                    </ScrollView>
                  </View>
                </View>
                <View style={styles.modalColumn}>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text style={styles.definitionText}>
                        {selectedItem ? selectedItem.category : ""}
                      </Text>
                    </ScrollView>
                  </View>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.modalImage}
                      source={{
                        uri: selectedItem ? selectedItem.picturePath : "",
                      }}
                    />
                  </View>
                  <View style={styles.definitionContainer}>
                    <ScrollView>
                      <Text style={styles.definitionText}>
                        {selectedItem ? selectedItem.lexicalUnit : ""}
                      </Text>
                    </ScrollView>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.audioButton}
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
                <View style={styles.audioButtonContent}>
                  <Ionicons name="volume-high-sharp" size={24} color="white" />
                  <Text style={styles.audioButtonText}>Hear this word</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    height: 42,
    borderRadius: 20,
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
    borderRadius: 20,
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
    borderRadius: 20,
  },
  noDataText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalCloseButton: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 20,
  },
  modalContainer: {
    height: Dimensions.get("window").height * 0.65,
    backgroundColor: "#284387",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  titleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 35,
    borderRadius: 20,
  },
  wordtileContainer: {
    padding: 5,
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 20,
  },
  wordTileText: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 23,
    height: Dimensions.get("window").height * 0.5,
    borderRadius: 20,
  },
  modalColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "48%",
    borderRadius: 20,
  },
  definitionContainer: {
    padding: 5,
    width: "100%",
    maxHeight: Dimensions.get("window").height * 0.15,
    backgroundColor: "#FFF",
    borderRadius: 20,
  },
  definitionText: {
    color: "#284387",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  imageContainer: {
    width: 128,
    height: 238,
    borderRadius: 8,
  },
  modalImage: {
    width: 128,
    height: 238,
    borderRadius: 8,
  },
  audioButton: {
    flex: 1,
    marginTop: 20,
    width: "100%",
    backgroundColor: "#4B639D",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
  audioButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  audioButtonText: {
    fontSize: 24,
    color: "white",
    marginLeft: 10,
  },
});