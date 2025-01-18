import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import CookingVideoAnimation from "../../../components/Cooking/CookingVideoAnimation";
import { SafeAreaView } from "react-native-safe-area-context";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const CookingHome = ({ navigation }) => {
  function handleStart() {
    navigation.navigate("CookingIngredients");
  }
  function handleBack() {
    navigation.navigate("Activites");
  }
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#284388]">
        <Button mode="contained" onPress={handleBack} className="bg-[#284388]">
          Home
        </Button>
        <View className="flex-1 bg-[#284388] items-center justify-evenly  px-4 py-1">
          <Text className="text-white text-3xl text-center ">
            Hi, Let's start Cooking Maggi in Irula !!
          </Text>
          <View className="">
            <CookingVideoAnimation />
            <Text className="text-white text-base text-center">
              Cooking needs Ingredients and Instructions
            </Text>
          </View>
          <Button mode="contained" onPress={handleStart}>
            <Text className="text-white text-lg text-center ">
              Let's start with Ingredients
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default CookingHome;
