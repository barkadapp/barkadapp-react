import * as React from "react";
import { View } from "react-native";
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  TextInput,
} from "react-native-paper";

export default function BidDialog({ visible, setVisible, setBid, setBidder }) {
  const handleOnPress = () => setVisible(false);

  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Bid (Pledge Amount)</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Bidding simply means that you pledge to pay the amount you bid if
              the event wins.
            </Paragraph>
            <TextInput
              label="Your name"
              onChangeText={(text) => setBidder(text)}
              style={{ marginTop: 20 }}
            />
            <TextInput
              keyboardType="numeric"
              label="Enter Amount"
              onChangeText={(text) => setBid(text)}
              style={{ marginTop: 20 }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleOnPress}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
