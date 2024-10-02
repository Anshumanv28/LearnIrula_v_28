// import React, { useState } from "react";
// import { View, StyleSheet, Switch } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Card, Button, Text } from "react-native-elements";
// import Icon from "react-native-vector-icons/FontAwesome";

// const ActivitySection = () => {
//   const navigation = useNavigation();
//   const [isTamil, setIsTamil] = useState(false);

//   const handleSpinWheelPress = () => navigation.navigate("SpinWheel");
//   const handleQuizPress = () => navigation.navigate("Quiz");
//   const toggleSwitch = () => setIsTamil(previousState => !previousState);

//   return (
//     <Card containerStyle={styles.card}>
//       <Card.Title>{isTamil ? "செயல்பாடுகள்" : "Activities"}</Card.Title>
//       <Card.Divider />
//       <Button
//         icon={<Icon name="refresh" size={15} color="white" />}
//         title={isTamil ? "சுழற்சி சக்கரம்" : "Spin Wheel"}
//         onPress={handleSpinWheelPress}
//         buttonStyle={styles.button}
//       />
//       <Button
//         icon={<Icon name="question" size={15} color="white" />}
//         title={isTamil ? "வினாடி வினா" : "Quiz"}
//         onPress={handleQuizPress}
//         buttonStyle={styles.button}
//       />
//       <View style={styles.switchContainer}>
//         <Text>{isTamil ? "ஆங்கிலம்" : "English"}</Text>
//         <Switch
//           trackColor={{ false: "#767577", true: "#81b0ff" }}
//           thumbColor={isTamil ? "#f5dd4b" : "#f4f3f4"}
//           onValueChange={toggleSwitch}
//           value={isTamil}
//         />
//         <Text>{isTamil ? "தமிழ்" : "Tamil"}</Text>
//       </View>
//     </Card>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     borderRadius: 8,
//     padding: 15,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     borderRadius: 20,
//     marginVertical: 10,
//     width: 100,
//   },
//   switchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginTop: 20,
//   },
// });

// export default ActivitySection;
