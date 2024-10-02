import { View} from "react-native";
import ModalInstructions from "./ModalInstructions";
const ModalComponentInstruction = ({item}) => {

  return (
    <>
      <View className="w-full h-full items-center justify-center ">
        <View className="bg-white/80 w-80 h-56 rounded-xl">
          <ModalInstructions item={item} tone={"tone.mp3"}/>
        </View>
      </View>
    </>
  );
};

export default ModalComponentInstruction;
