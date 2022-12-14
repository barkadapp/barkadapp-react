import EventProposal from "./screens/EventProposal";
import Proposal from "./screens/Proposal";
import ProposedEvents from "./screens/ProposedEvents";
import Selection from "./screens/Selection";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SQLite from "expo-sqlite";
import React from "react";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";

const Stack = createNativeStackNavigator();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  myOwnProperty: true,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    primary: "#163E62",
    secondary: "#446F8E",
    card: "#fff",
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
  },
};

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  const db = SQLite.openDatabase("943db4d8e58ecad9a0f90ae8d1f4d522.db");
  return db;
}

global.db = openDatabase();

export default function App() {
  React.useEffect(() => {
    global.db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS events (id integer primary key not null, title text, description text, date text, location text, expiration text, bid numeric, bidders text);"
      );
    });
  });

  return (
    <PaperProvider theme={CombinedDefaultTheme}>
      <NavigationContainer theme={CombinedDefaultTheme}>
        <Stack.Navigator initialRouteName="Selection">
          <Stack.Screen name="Selection" component={Selection} />
          <Stack.Screen name="Propose an Event" component={EventProposal} />
          <Stack.Screen name="Proposed Events" component={ProposedEvents} />
          <Stack.Screen name="Proposal" component={Proposal} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
