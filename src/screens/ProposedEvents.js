import BidDialog from "../components/BidDialog";
import React from "react";
import { Text, View, ScrollView } from "react-native";
import { Button, Card, Paragraph, Divider } from "react-native-paper";

export default function ProposedEvents({ navigation }) {
  const [proposedEvents, setProposedEvents] = React.useState([]);
  const [eventId, setEventId] = React.useState(0);
  const [bid, setBid] = React.useState(0);
  const [bidder, setBidder] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const fetchEvents = () => {
    global.db.transaction((tx) => {
      tx.executeSql("SELECT * FROM events", [], (_, { rows }) => {
        setProposedEvents(rows._array.reverse());
      });
    });
  };

  const reset = () => {
    global.db.transaction((tx) => {
      tx.executeSql("DELETE FROM events", []);
    });

    fetchEvents();
  };

  const updateEventBid = (id, bid) => {
    global.db.transaction((tx) => {
      tx.executeSql(
        "SELECT bid FROM events WHERE id = ?",
        [id],
        (_, { rows }) => {
          const newBid = Number(rows._array[0].bid) + Number(bid);
          tx.executeSql("UPDATE events SET bid = ? WHERE id = ?", [newBid, id]);
        }
      );

      // events has a bidders column, which is a json object. append the bidder to the bidders array
      tx.executeSql(
        "SELECT bidders FROM events WHERE id = ?",
        [id],
        (_, { rows }) => {
          const bidders = JSON.parse(rows._array[0].bidders);
          const bidderExists = bidders.find((b) => b.bidder === bidder);

          if (bidderExists) {
            bidderExists.bid = Number(bidderExists.bid) + Number(bid);
          } else {
            bidders.push({ bidder: bidder, bid: bid });
          }

          tx.executeSql("UPDATE events SET bidders = ? WHERE id = ?", [
            JSON.stringify(bidders),
            id,
          ]);
        }
      );
    });

    setBid(0);
    setEventId(0);
    setVisible(false);
    fetchEvents();
  };

  React.useEffect(() => {
    if (eventId !== 0 && bid !== 0) {
      updateEventBid(eventId, bid);
      fetchEvents();
    } else {
      fetchEvents();
    }
  }, [visible]);

  return (
    <ScrollView style={{ margin: 20 }}>
      <BidDialog
        visible={visible}
        setVisible={setVisible}
        setBid={setBid}
        setBidder={setBidder}
      />
      <Button
        icon="close"
        mode="contained"
        style={{ alignSelf: "flex-end" }}
        onPress={reset}
      >
        Reset
      </Button>
      <Divider style={{ marginTop: 10, marginBottom: 10 }} />
      {proposedEvents?.map((event) => {
        return (
          <View key={event.id} style={{ marginBottom: 10 }}>
            <Card
              onPress={() =>
                navigation.navigate("Proposal", {
                  eventId: event.id,
                  otherParam: "anything",
                })
              }
            >
              <Card.Title title={event.title} />
              <Card.Content>
                <Text>{event.location}</Text>
                <Text>{event.date}</Text>
                <Paragraph>
                  {event.description}
                </Paragraph>
              </Card.Content>
              <Card.Actions>
                <Text>₱ {event.bid}</Text>
                <Button
                  onPress={() => {
                    setVisible(true);
                    setEventId(event.id);
                  }}
                >
                  Bid
                </Button>
              </Card.Actions>
            </Card>
          </View>
        );
      })}
    </ScrollView>
  );
}
