import { useState } from "react";
import { List, Modal, Portal, Button } from "react-native-paper";
import ModalComponentIngredient from './ModalComponentIngredient'
const ModalItem = ({ data }) => {
    const [expanded, setExpanded] = useState(false);
    const handlePress = () => setExpanded(!expanded);
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    return (
      <>
        <List.Accordion
          title={data.item}
          left={(props) => <List.Icon {...props} icon="food" />}
          expanded={expanded}
          onPress={handlePress}
        >
          <Portal>
            <Modal visible={visible} onDismiss={hideModal}>
              <ModalComponentIngredient item={data.item}/>
            </Modal>
          </Portal>
          <Button onPress={showModal}>Show</Button>
        </List.Accordion>
      </>
    );
  };


export default ModalItem ;