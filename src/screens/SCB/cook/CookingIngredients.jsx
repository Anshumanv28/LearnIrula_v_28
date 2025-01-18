import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageMaggiComponent from "../../../components/Cooking/ImageMaggiComponent";
import ListAcc from "../../../components/Cooking/ListAccIngredient";
const CookingIngredients = ({ navigation }) => {
  const ingredients = [
    { id: "1", quantity: "1", item: "Packet MAGGI 2-Minute Noodles (Masala)" },
    { id: "2", quantity: "4", item: "Tablespoons MAGGI Rich Tomato Ketchup" },
    { id: "3", quantity: "1", item: "Tablespoon Oil" },
    { id: "4", quantity: "1", item: "Teaspoon Cumin Seeds" },
    { id: "5", quantity: "2", item: "Tomato (Finely Chopped)" },
    { id: "6", quantity: "1", item: "Onion (Finely Chopped)" },
    { id: "7", quantity: "1", item: "Cup Peas" },
    { id: "8", quantity: "1", item: "Pinch Salt" },
  ];
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#284388]">
        <View className="bg-[#284388] flex-1 pt-0 justify-between">
          <ImageMaggiComponent />
          <ListAcc data={ingredients} navigation={navigation} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default CookingIngredients;
