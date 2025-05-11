import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
  Animated,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function AboutScreen() {
  const [expanded, setExpanded] = useState(null);

  const handleListItemPress = (index) => {
    setExpanded((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderListItem = (title, description, index, image) => (
    <TouchableOpacity
      onPress={() => handleListItemPress(index)}
      style={styles.listItemContainer}
    >
      <LinearGradient
        colors={
          expanded === index ? ["#4A90E2", "#357ABD"] : ["#fff", "#f5f5f5"]
        }
        style={styles.gradient}
      >
        <View style={styles.listItemTitleContainer}>
          {image && <Image source={image} style={styles.developerImage} />}
          <Text
            style={[
              styles.listItemTitle,
              expanded === index && styles.expandedTitle,
            ]}
          >
            {title}
          </Text>
          <Ionicons
            name={expanded === index ? "chevron-up" : "chevron-down"}
            size={24}
            color={expanded === index ? "#fff" : "#666"}
            style={styles.chevron}
          />
        </View>
        {expanded === index && (
          <Animated.View style={styles.descriptionContainer}>
            <Text
              style={[
                styles.listItemDescription,
                expanded === index && styles.expandedDescription,
              ]}
            >
              {description}
            </Text>
          </Animated.View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={["#284387", "#1a2f5a"]} style={styles.background}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>About Learn Irula</Text>
            <Text style={styles.headerSubtitle}>
              Discover the story behind our app
            </Text>
          </View>

          {renderListItem(
            "App Overview",
            "The Irula app is a mobile dictionary designed to help preserve the Irula language, an endangered language spoken by a tribal community in southern India. Our mission is to make language learning accessible and engaging through interactive features and comprehensive resources.",
            0
          )}

          {renderListItem(
            "About IRULA",
            "Irula is a tribe that primarily inhabits the southern states of India such as Tamil Nadu, Kerala, and Karnataka. They have a rich cultural heritage and their language is an integral part of their identity. Our app aims to help preserve and promote this unique language.",
            1
          )}

          {renderListItem("Developers", "Meet the team behind this app!", 2)}

          {expanded === 2 && (
            <View style={styles.developerListContainer}>
              <View style={styles.developerItemContainer}>
                <Text style={styles.developerItemName}>Anshuman Mishra</Text>
                <Text style={styles.developerItemTitle}>Developer</Text>
                <View style={styles.socialLinks}>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() =>
                      Linking.openURL("https://github.com/Anshumanv28")
                    }
                  >
                    <Ionicons name="logo-github" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() =>
                      Linking.openURL(
                        "https://www.linkedin.com/in/anshuman-mishra-726781364/"
                      )
                    }
                  >
                    <Ionicons name="logo-linkedin" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.developerItemContainer}>
                <Text style={styles.developerItemName}>Abhinav Gosain</Text>
                <Text style={styles.developerItemTitle}>Developer</Text>
                <View style={styles.socialLinks}>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() =>
                      Linking.openURL("https://github.com/abhinavgosain")
                    }
                  >
                    <Ionicons name="logo-github" size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() =>
                      Linking.openURL(
                        "https://www.linkedin.com/in/abhinavgosain/"
                      )
                    }
                  >
                    <Ionicons name="logo-linkedin" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {renderListItem(
            "Acknowledgment",
            "We would like to express our gratitude to SRM Institute of Science and Technology for their support and resources in making this project possible. Special thanks to our mentors and the Irula community for their invaluable contributions.",
            3
          )}
        </ScrollView>
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
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  listItemContainer: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    padding: 15,
  },
  listItemTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  expandedTitle: {
    color: "#fff",
  },
  chevron: {
    marginLeft: 10,
  },
  descriptionContainer: {
    marginTop: 15,
  },
  listItemDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  expandedDescription: {
    color: "#fff",
  },
  developerListContainer: {
    marginTop: 15,
  },
  developerItemContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 15,
  },
  developerItemPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#fff",
  },
  developerItemName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  developerItemTitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 15,
    textAlign: "center",
  },
  socialLinks: {
    flexDirection: "row",
    justifyContent: "center",
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  developerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
