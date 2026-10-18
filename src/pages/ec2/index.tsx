import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EC2Card } from "./ec2Card";

const INITIAL_INSTANCES = [
  { name: "dev", displayName: "Development Server" },
  //{ name: "openalgo", displayName: "Openalgo Server" },
  //{ name: "trade-dev", displayName: "Trade Dev Server" },
];

const Ec2Container = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EC2 Command Center</Text>
        <Text style={styles.headerSubtitle}>
          Real-time cloud infrastructure monitoring
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {INITIAL_INSTANCES.map((inst, index) => (
          <EC2Card
            key={index}
            instanceName={inst.name}
            displayName={inst.displayName}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Ec2Container;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#1e293b" },
  headerTitle: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  scrollContainer: { padding: 16 },
});
