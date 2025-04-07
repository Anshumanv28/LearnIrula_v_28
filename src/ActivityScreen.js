import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Button, Icon } from "react-native-elements";

function ActivityScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Activities</Text>

        <View style={styles.buttonsContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title="Check Speech"
              onPress={() => navigation.navigate("SpeechCheck")}
              buttonStyle={[styles.button, { backgroundColor: "#EF5350" }]}
              icon={<Icon name="mic" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Take a Quiz"
              onPress={() => navigation.navigate("Quiz")}
              buttonStyle={[styles.button, { backgroundColor: "#5C6BC0" }]}
              icon={<Icon name="school" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Spin Wheel"
              onPress={() => navigation.navigate("SpinWheel")}
              buttonStyle={[styles.button, { backgroundColor: "#FFA726" }]}
              icon={<Icon name="refresh" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Scenario Based Exercise"
              onPress={() => navigation.navigate("SCLearn")}
              buttonStyle={[styles.button, { backgroundColor: "#66BB6A" }]}
              icon={<Icon name="casino" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Crossword"
              onPress={() => navigation.navigate("Crossword")}
              buttonStyle={[styles.button, { backgroundColor: "#800080" }]}
              icon={<Icon name="grid-on" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Jumble Word"
              onPress={() => navigation.navigate("Jumbleword")}
              buttonStyle={[styles.button, { backgroundColor: "#FF5733" }]}
              icon={<Icon name="spellcheck" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="API Fetch Words"
              onPress={() => navigation.navigate("MLScreen")}
              buttonStyle={[styles.button, { backgroundColor: "#FF9999" }]}
              icon={<Icon name="cloud-download" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <Button
              title="Word Tiles"
              onPress={() => navigation.navigate("Test")}
              buttonStyle={[styles.button, { backgroundColor: "#4DB6AC" }]}
              icon={<Icon name="apps" type="material" color="#ffffff" size={24} />}
              titleStyle={styles.buttonText}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    color: "#37474F",
    marginBottom: 30,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonWrapper: {
    borderRadius: 30,
    marginVertical: 8,
    minWidth: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 12,
    letterSpacing: 0.5,
  },
});

export default ActivityScreen;
