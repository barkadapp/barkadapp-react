import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Title, Avatar, Paragraph } from "react-native-paper";

export default function Proposal({ route, navigation }) {
  const { eventId, otherParam } = route.params;
  const [proposal, setProposal] = React.useState({});

  const fetchProposal = () => {
    global.db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM events WHERE id = ?",
        [eventId],
        (_, { rows }) => {
          setProposal(rows._array[0]);
        }
      );
    });
  };

  React.useEffect(() => {
    navigation.setOptions({
      title: "Proposal",
    });

    fetchProposal();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Title style={{ marginBottom: 10 }}>{proposal.title}</Title>
      <Image
        style={{
          width: 400,
          height: 200,
          alignSelf: "center",
          objectFit: "fit",
        }}
        source={{
          uri: "https://picsum.photos/400/400",
        }}
      />

      <View style={styles.section}>
        <Text style={{ color: "gray" }}>Description</Text>
        <Paragraph
          style={{
            textAlign: "justify",
          }}
        >
          {proposal.description}
        </Paragraph>
      </View>
      <View style={styles.section}>
        <Text style={{ color: "gray" }}>When</Text>
        <Text>{proposal.date}</Text>
      </View>
      <View style={styles.section}>
        <Text style={{ color: "gray" }}>Where</Text>
        <Text>{proposal.location}</Text>
      </View>
      <View style={styles.section}>
        <Text style={{ color: "gray" }}>Total Pledge</Text>
        <Text>₱ {proposal.bid}</Text>
      </View>
      <View style={styles.section}>
        <Text style={{ color: "gray" }}>Bidders</Text>
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {proposal.bidders &&
            JSON.parse(proposal.bidders).map((bidder, idx) => (
              <View key={idx} style={{ display: "flex", flexDirection: "row" }}>
                <Avatar.Image
                  size={24}
                  source={`https://avatars.dicebear.com/api/adventurer/${Math.random()
                    .toString(36)
                    .substring(7)}.svg`}
                  style={{ marginRight: 10 }}
                />
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ marginRight: 10 }}>{bidder.bidder}</Text>
                  <Text>&ndash;</Text>
                  <Text>₱ {bidder.bid}</Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
});
