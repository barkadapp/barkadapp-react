import RNDateTimePicker from "@react-native-community/datetimepicker";
import { SQLite } from "expo-sqlite/build";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import {
  HelperText,
  TextInput,
  Menu,
  Button,
  Divider,
} from "react-native-paper";

const expirationLabels = [
  { value: 30, label: "30 minutes" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
];

export default function EventProposal({ navigation }) {
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [pickerMode, setPickerMode] = React.useState("date");
  const [showPicker, setShowPicker] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [expiration, setExpiration] = React.useState({
    value: 30,
    label: "30 minutes",
  });
  const [createBtnDisabled, setCreateBtnDisabled] = React.useState(true);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handSelectExpire = (expire) => {
    setExpiration(expire);
    closeMenu(false);
  };

  const handleCreateEvent = () => {
    try {
      global.db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO events (title, description, location, date, expiration, bid, bidders) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            title,
            description,
            location,
            date.toDateString(),
            expiration.value,
            0,
            JSON.stringify([]),
          ]
        );
      });
      navigation.navigate("Proposed Events");
    } catch (err) {
      console.error(err);
    }
  };

  const onDateChange = (_event, selectedDate) => {
    setShowPicker(false);
    setDate(selectedDate);
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      // for iOS, add a button that closes the picker
    }
    setPickerMode(currentMode);
    setShowPicker(true);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  React.useEffect(() => {
    setCreateBtnDisabled(title.length === 0 || description.length === 0);
  }, [title, description, expiration]);

  return (
    <ScrollView>
      <View style={styles.container}>
        {showPicker && (
          <RNDateTimePicker
            testID="dateTimePicker"
            minimumDate={new Date()}
            value={date || new Date()}
            mode={pickerMode}
            is24Hour={true}
            onChange={onDateChange}
          />
        )}
        <Image
          style={{ alignSelf: "center" }}
          source={require("../../assets/event-creation-graphic.png")}
        />
        <Text style={styles.description}>
          Enjoying some time with the barkada is a great way to create positive
          memories and your strengthen relationship. Proposing an event can
          provide an opportunity to get creative and come up with something
          unique and fun. Plus, it's also another great way to bond and have
          some fun!
        </Text>
        <Divider />
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>What's the event called?</Text>
          <TextInput
            mode="outlined"
            label="Title"
            value={title}
            onChangeText={setTitle}
          />
          <HelperText type="error" visible={title.length === 0}>
            Title is required
          </HelperText>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>Where will it take place?</Text>
          <TextInput
            mode="outlined"
            label="Location"
            value={location}
            onChangeText={setLocation}
          />
          <HelperText type="error" visible={location.length === 0}>
            Location is required
          </HelperText>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>When's it gonna happen?</Text>
          <Button mode="outlined" onPress={showDatepicker}>
            {date.toDateString()}
          </Button>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.inputLabel}>What's it about?</Text>
          <TextInput
            mode="outlined"
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={10}
          />
          <HelperText type="error" visible={description.length === 0}>
            Description is required
          </HelperText>
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.expireLabel}>
            How long will the bidding last?
          </Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button icon="chevron-down" mode="outlined" onPress={openMenu}>
                {expiration.label}
              </Button>
            }
          >
            {expirationLabels.map((expire) => (
              <Menu.Item
                key={expire.value}
                value={expire.value}
                onPress={() => {
                  handSelectExpire(expire);
                }}
                title={expire.label}
              />
            ))}
          </Menu>
        </View>
        <Divider style={styles.divier} />
        <Button
          mode="contained"
          style={styles.createBtn}
          disabled={createBtnDisabled}
          onPress={handleCreateEvent}
        >
          Create Event
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  description: {
    textAlign: "justify",
    fontSize: 12,
  },
  expireLabel: {
    marginBottom: 10,
  },
  divier: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 10,
  },
  fieldContainer: {
    marginTop: 20,
  },
  createBtn: {
    marginTop: 20,
  },
});
