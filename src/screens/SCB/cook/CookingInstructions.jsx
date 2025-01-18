import { SafeAreaView } from "react-native-safe-area-context";
import ListAcc from "../../../components/Cooking/ListAccInstruction";
import ImageInstrComponent from "../../../components/Cooking/ImageInstrComponent";
const CookingInstructions = ({ navigation }) => {
  const recipeSteps = [
    {
      id: "1",
      step: "Prepare ingredients as mentioned in the list. Easy Peasy MAGGI Noodles Recipe",
    },
    {
      id: "2",
      step: "Heat the oil and then roast the cumin seeds in it. Then, toss in the tomatoes, the onions and cook them well. Add the peas and the MAGGI Tomato ketchup, give it a stir, and let them cook for a while! Easy Peasy MAGGI Noodles Recipe",
    },
    {
      id: "3",
      step: "Cook one pack of MAGGI Masala Noodles (just follow the instructions on the pack!) and transfer it onto a dish. Easy Peasy MAGGI Noodles Recipe",
    },
    {
      id: "4",
      step: "Put the cumin-tomato-onion mix right on top of the MAGGI noodles and you are ready to serve the easy peasy fun! Easy Peasy MAGGI Noodles Recipe",
    },
  ];

  function handleStart() {
    navigation.navigate("CookingIngredients");
  }
  return (
    <>
      <SafeAreaView className="flex-1 bg-[#284388]">
        <ImageInstrComponent />
        <ListAcc data={recipeSteps} navigation={navigation} />
      </SafeAreaView>
    </>
  );
};

export default CookingInstructions;
