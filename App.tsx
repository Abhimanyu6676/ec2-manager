import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Ec2Container from "./src/pages/ec2";

export default function App() {
  return <Ec2Container />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
