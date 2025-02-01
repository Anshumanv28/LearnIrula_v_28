import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, Icon } from "react-native-elements";

function ActivityScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Activities</Text>

      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Check Speech"
            onPress={() => navigation.navigate("SpeechCheck")}
            buttonStyle={{ ...styles.button, backgroundColor: "#EF5350" }}
            icon={<Icon name="mic" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Take a Quiz"
            onPress={() => navigation.navigate("Quiz")}
            buttonStyle={{ ...styles.button, backgroundColor: "#5C6BC0" }}
            icon={<Icon name="school" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Spin Wheel"
            onPress={() => navigation.navigate("SpinWheel")}
            buttonStyle={{ ...styles.button, backgroundColor: "#FFA726" }}
            icon={<Icon name="refresh" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Scenario Based Exercise"
            onPress={() => navigation.navigate("SCLearn")}
            buttonStyle={{ ...styles.button, backgroundColor: "#66BB6A" }}
            icon={<Icon name="casino" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Crossword"
            onPress={() => navigation.navigate("Crossword")}
            buttonStyle={{ ...styles.button, backgroundColor: "#800080" }}
            icon={<Icon name="grid-on" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View>

        <View style={styles.buttonWrapper}>
          <Button
            title="Jumble Word"
            onPress={() => navigation.navigate("Jumbleword")}
            buttonStyle={{ ...styles.button, backgroundColor: "#FF5733" }} // Red-Orange
            icon={<Icon name="spellcheck" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View>
        {/* <View style={styles.buttonWrapper}>
          <Button
            title="API Featch Words"
            onPress={() => navigation.navigate("MLScreen")}
            buttonStyle={{ ...styles.button, backgroundColor: "#FF9999" }} // Red-Orange
            icon={<Icon name="spellcheck" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Test"
            onPress={() => navigation.navigate("Test")}
            buttonStyle={{ ...styles.button, backgroundColor: "#FF9999" }} // Red-Orange
            icon={<Icon name="spellcheck" type="material" color="#ffffff" />}
            titleStyle={styles.buttonText}
          />
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6FA", // Soft Lavender
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    color: "#37474F", // Darker Slate Gray for stronger contrast
    marginBottom: 30,
    fontWeight: "bold",
    letterSpacing: 1, // Slightly spaced out letters
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    flex: 1,
    justifyContent: "flex-start",
  },
  buttonsContainer: {
    backgroundColor: "#FFFFFF", // Pure white for a clean, modern look
    borderRadius: 20,
    flex: 5,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonWrapper: {
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
});

export default ActivityScreen;
