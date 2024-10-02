import { View} from "react-native";
import ModalItems from "./ModalItems";
const ModalComponentIngredient = ({item}) => {

  return (
    <>
      <View className="w-full h-full items-center justify-center ">
        <View className="bg-white/80 w-80 h-56 rounded-xl">
          <ModalItems item={item} />
        </View>
      </View>
    </>
  );
};

export default ModalComponentIngredient;
