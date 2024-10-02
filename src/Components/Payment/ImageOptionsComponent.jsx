import { Image,View } from "react-native";

const ImageOptionsComponent = () => {
  return (
    <>
      <View className="w-screen h-[35vh]">
        <Image source={require("./Invoice.png")} className="w-full h-full" />
      </View>
    </>
  );
};

export default ImageOptionsComponent;
