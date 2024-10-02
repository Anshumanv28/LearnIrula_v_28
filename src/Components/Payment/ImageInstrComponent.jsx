import {View} from "react-native";
import { Video } from "expo-av";
import videoSource from './E-Wallet.mp4' ;
const ImageInstrComponent = () => {

  return (
    <>
      <View className="flex-1 px-4">
        <Video  source={videoSource} useNativeControls={false} resizeMode="contain"  shouldPlay className="flex-1"/>
      </View>
    </>
  );
};



export default ImageInstrComponent;
