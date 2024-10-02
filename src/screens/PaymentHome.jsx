import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import VideoAnimation from "../Components/Payment/VideoAnimation";
import { SafeAreaView } from "react-native-safe-area-context";

const PaymentHome = ({ navigation }) => {
  function handleStart() {
    navigation.navigate("PaymentOptions");
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
            Hi, Let's start Paying in Irula !!
          </Text>
          <View className="">
            <VideoAnimation />
            <Text className="text-white text-base text-center">
             Make sure you have financial intelligence
            </Text>
          </View>
          <Button mode="contained" onPress={handleStart}>
            <Text className="text-white text-lg text-center ">
              Let's see different Payments
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default PaymentHome;
