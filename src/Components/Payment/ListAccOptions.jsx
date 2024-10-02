import { View,FlatList} from "react-native";
import { Button,List} from "react-native-paper";
import ModalItem from "./ModalItem";
const ListAcc = ({data,navigation}) => {

  function handleStart() {
    navigation.navigate("PaymentInstructions");
  }

  return (
    <>
      <View className="px-4 flex-1 rounded-lg">
        <List.Section
          title="Types of Payments"
          className="bg-white rounded-lg flex-1"
          titleStyle={{ fontSize: 15, fontWeight: "bold" }}
        >
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <ModalItem data={item} />
            )}
            keyExtractor={(item) => item.id}
          />
        </List.Section>
        <View className="items-center justify-center my-2">
        <Button mode="contained" textColor="white" onPress={handleStart}>Let's Learn Process in Irula !!</Button>
        </View>
      </View>
    </>
  );
};

export default ListAcc;
