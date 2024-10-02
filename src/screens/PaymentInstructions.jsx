import { SafeAreaView } from "react-native-safe-area-context";
import ListAcc from '../Components/Payment/ListAccInstruction';
// import ImageInstrComponent from '../Components//Payment/ImageInstrComponent';
import ImageOptionsComponent from "../Components/Payment/ImageOptionsComponent";
const PaymentInstructions = ({ navigation }) => {
  const googlePayTutorialSteps = [
    { 
      id: "1", 
      step: "On the main screen, you'll find different options for transactions. Choose 'Pay Bills' for electricity or mobile recharges, or 'Send Money' for transferring money to a person."
    },
    { 
      id: "2", 
      step: "For paying bills: Tap on 'Pay Bills', and select the type of bill you want to pay (e.g., 'Electricity' or 'Mobile Recharge')."
    },
    { 
      id: "3", 
      step: "After selecting the bill type, choose your biller from the list provided. You may need to search for your specific provider."
    },
    { 
      id: "4", 
      step: "Enter your account details for the biller (such as account number or customer ID) and the amount to be paid. Tap 'Continue'."
    },
    { 
      id: "5", 
      step: "Review the payment details. Confirm and authenticate the payment using your security method (PIN, fingerprint, or face recognition)."
    },
    { 
      id: "6", 
      step: "For sending money: Tap on 'Send Money', and enter the recipient's phone number, email, or name. You may also choose them from your contacts."
    },
    { 
      id: "7", 
      step: "Enter the amount you wish to send. Optionally, you can add a note for the recipient."
    },
    { 
      id: "8", 
      step: "Review and confirm the payment details. Authenticate the transaction with your chosen security method."
    },
    { 
      id: "9", 
      step: "After completing any transaction, you will receive a confirmation notification. All transactions can be viewed in the 'Transaction History' section of the app."
    }
  ];
  
  return (
    <>
     <SafeAreaView className="flex-1 bg-[#284388]"> 
     {/* <ImageInstrComponent /> */}
     <ImageOptionsComponent />
     <ListAcc data={googlePayTutorialSteps} navigation={navigation}/>
     </SafeAreaView>
    </>
  )
}

export default PaymentInstructions;
