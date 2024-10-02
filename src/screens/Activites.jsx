import { SafeAreaView } from "react-native-safe-area-context";
import ImageCourseComponent from "../Components/ImageCourseComponent";
import { Button } from "react-native-paper";
import { Text, View } from "react-native";
const Activites = ({ navigation }) => {
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#284388]">
        <ImageCourseComponent />
        <View className="flex-1 flex-wrap ">
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate("Cooking");
            }}
            className="w-52  bg-[#284388]"
          >
            <Text className="text-white text-lg text-center  underline">
            → Cook in Irula...
            </Text>
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate("Payments");
            }}
            className="w-52  bg-[#284388]"
          >
            <Text className="text-white text-lg text-center underline">
          → Pay in Irula...
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};

export default Activites;
