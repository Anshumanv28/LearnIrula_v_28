import { View,FlatList} from "react-native";
import { Button,List} from "react-native-paper";
import ModalInstruction from "./ModalInstruction";
const ListAcc = ({data,navigation}) => {

  function handleStart() {
    navigation.navigate("CookingHome");
  }

  return (
    <>
      <View className="px-4 flex-1 rounded-lg">
        <List.Section
          title="Instructions"
          className="bg-white rounded-lg flex-1"
          titleStyle={{ fontSize: 15, fontWeight: "bold" }}
        >
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ModalInstruction data={item} />
            )}
            keyExtractor={(item) => item.id}
          />
        </List.Section>
        <View className="items-center justify-center my-2">
        <Button mode="contained" textColor="white" onPress={handleStart}>End , Let's start again Learning !!</Button>
        </View>
      </View>
    </>
  );
};

export default ListAcc;
