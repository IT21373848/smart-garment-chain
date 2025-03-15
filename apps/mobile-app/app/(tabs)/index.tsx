import { Image, StyleSheet, Platform, View, Text, Button } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<></>} // headerImage={
      //   <Image
      //     source={require('@/assets/images/partial-react-logo.png')}
      //     style={styles.reactLogo}
      //   />
      // }
    >
      {/* Welcome Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.title}>
          Welcome to the SCM App!
        </ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Inventory Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Inventory Management</ThemedText>
        <ThemedText>
          Manage and track all products in your warehouse. Keep your stock
          levels up-to-date.
        </ThemedText>
        <Button title="Go to Inventory" onPress={() => {}} />
      </ThemedView>

      {/* Orders Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Order Tracking</ThemedText>
        <ThemedText>
          Track your customer orders in real-time and manage their status across
          all stages.
        </ThemedText>
        <Button title="View Orders" onPress={() => {}} />
      </ThemedView>

      {/* Shipments Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">Shipment Monitoring</ThemedText>
        <ThemedText>
          Track shipments and ensure on-time deliveries with live updates and
          real-time maps.
        </ThemedText>
        <Button title="Track Shipments" onPress={() => {}} />
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionContainer: {
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#F4F4F4",
    paddingVertical: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 15,
  },
  reactLogo: {
    height: 178,
    width: 290,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});
