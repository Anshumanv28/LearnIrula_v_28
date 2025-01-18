import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function AboutScreen() {
  const [expanded, setExpanded] = useState(null);

  const handleListItemPress = (index) => {
    setExpanded((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderListItem = (title, description, index, image) => (
    <TouchableWithoutFeedback onPress={() => handleListItemPress(index)}>
      <View style={styles.listItemContainer}>
        <View style={styles.listItemTitleContainer}>
          {image && <Image source={image} style={styles.developerImage} />}
          <Text style={styles.listItemTitle}>{title}</Text>
        </View>
        {expanded === index && (
          <ScrollView>
            <Text style={styles.listItemDescription}>{description}</Text>
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <ScrollView style={styles.container}>
      {renderListItem(
        "App Overview",
        <>
          <Text>
            The Irula app is a mobile dictionary designed to help preserve the
            Irula language, an endangered language spoken by a tribal community
            in southern India...
          </Text>
        </>,
        0
      )}
      {renderListItem(
        "About IRULA",
        <>
          <Text>
            Irula is a tribe that primarily inhabits the southern states of
            India such as Tamil Nadu, Kerala, and Karnataka...
          </Text>
        </>,
        1
      )}
      {renderListItem("Developers", "Meet the team behind this app!", 2)}
      {expanded === 2 && (
        <ScrollView horizontal style={styles.developerListContainer}>
          <View style={styles.developerItemContainer}>
            <Image
              source={require("./../../assets/images/Kevin_pic.jpg")}
              style={styles.developerItemPhoto}
            />
            <Text style={styles.developerItemName}>Kevin Jinu</Text>
            <Text style={styles.developerItemTitle}>The Backbone</Text>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Icon
                name="github"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="#999"
                onPress={() => Linking.openURL("https://github.com/kevintjinu")}
              />
              <Icon
                name="linkedin"
                size={30}
                style={{ marginHorizontal: 10 }}
                color="white"
                onPress={() =>
                  Linking.openURL("https://www.linkedin.com/in/kevin-jinu/")
                }
              />
            </View>
          </View>
          {/* Add other developers here */}
        </ScrollView>
      )}
      {renderListItem(
        "Acknowledgment",
        <>
          <Text>
            We would like to express our gratitude to SRM Institute of Science
            and Technology...
          </Text>
        </>,
        3
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#284387",
  },
  listItemContainer: {
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "white",
  },
  listItemTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listItemDescription: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "justify",
  },
  developerListContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  developerItemContainer: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  developerItemPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  developerItemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "white",
  },
  developerItemTitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    maxWidth: 112,
    height: 50,
  },
  developerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
