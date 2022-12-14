import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

export default function Selection({ navigation }) {
  return (
    <View
      style={{
        margin: 20,
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        style={{
          marginBottom: 20,
        }}
        icon="pencil-outline"
        mode="elevated"
        onPress={() => navigation.navigate("Propose an Event")}
      >
        Propose an event
      </Button>
      <Button
        style={{
          marginBottom: 20,
        }}
        icon="import"
        mode="elevated"
        onPress={() => navigation.navigate("Proposed Events")}
      >
        View proposed events
      </Button>
    </View>
  );
}
