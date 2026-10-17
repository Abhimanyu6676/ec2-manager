import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Ec2Container from "./src/pages/ec2";

export default function App() {
  return (
    <SafeAreaProvider>
      <Ec2Container />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
