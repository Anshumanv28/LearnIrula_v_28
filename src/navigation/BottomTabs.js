import "react-native-gesture-handler";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Ensure you have @expo/vector-icons installed
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Animated, View, StyleSheet } from 'react-native';
import Home from "./../screens/HomeScreen";
import Glossary from "../Glossary";
import AboutScreen from "../screens/AboutScreen";
import ActivityStackNavigator from "./ActivityStackNavigator"; // Import the stack navigator

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#284387",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.5)",
        tabBarStyle: {
          backgroundColor: "#284387",
          borderTopWidth: 0,
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#284387', '#1a2f5a']}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize = focused ? 28 : 24;

          if (route.name === 'LearnIrula') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Activity Screen') {
            iconName = focused ? 'apps' : 'apps-outline';
          } else if (route.name === 'Glossary') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={iconSize} color={color} />
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen
        name="LearnIrula"
        component={Home}
        options={{
          tabBarLabel: "Home",
          headerTitleAlign: "center",
          headerTitle: "Learn Irula",
        }}
      />
      <Tab.Screen
        name="Activity Screen"
        component={ActivityStackNavigator}
        options={{
          tabBarLabel: "Activities",
          headerTitleAlign: "center",
          headerTitle: "Activities",
        }}
      />
      <Tab.Screen
        name="Glossary"
        component={Glossary}
        options={{
          tabBarLabel: "Glossary",
          headerTitleAlign: "center",
          headerTitle: "Irula Glossary",
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarLabel: "About",
          headerTitleAlign: "center",
          headerTitle: "About Learn Irula",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
});

export default BottomTabs;
