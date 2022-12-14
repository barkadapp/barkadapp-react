import EventCreation from "./EventProposal";
import React from "react";
import { BottomNavigation } from "react-native-paper";

export default function Creator() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Event Creation",
      focusedIcon: "home",
      unfocusedIcon: "home-variant-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: EventCreation,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
