import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import ImageOptionsComponent from "../components/Payment/ImageOptionsComponent";
// import ListAcc from "../components/Payment/ListAccOptions";
const PaymentOptions = ({ navigation }) => {
  const paymentOptions = [
    {
      id: "1",
      item: "Recharge",
    },
    {
      id: "2",
      item: "Electricity Bill",
    },
    {
      id: "3",
      item: "Send Money",
    },
  ];

  return (
    <>
      <SafeAreaView className="flex-1 bg-[#284388]">
        <View className="bg-[#284388] flex-1 pt-0 justify-between">
          <ImageOptionsComponent />
          <ListAcc data={paymentOptions} navigation={navigation} />
        </View>
      </SafeAreaView>
    </>
  );
};

export default PaymentOptions;
