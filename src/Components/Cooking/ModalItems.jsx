import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { Audio } from "expo-av";
import { useState, useEffect } from "react";
const ModalItems = ({item}) => {
  const [sound, setSound] = useState(null);
  const playSound = async () => {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(require("./tone.mp3"));
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  };
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <>
      <View className="flex-1 items-center justify-center gap-2">
        <Text>{item}</Text>
        <View className="items-center justify-center flex-row gap-2">
          <Button mode="contained" icon="play" onPress={playSound}>
            English
          </Button>
          <Button mode="contained" icon="play" onPress={playSound}>
            Irula
          </Button>
        </View>
      </View>
    </>
  );
};

export default ModalItems;
