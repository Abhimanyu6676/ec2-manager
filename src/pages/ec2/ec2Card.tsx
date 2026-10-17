import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const API_BASE_URL = "https://2og55qbwjb.execute-api.ap-south-1.amazonaws.com";

type action_i = "status" | "start" | "stop" | "reboot";

export const EC2Card = ({
  instanceName,
  displayName,
}: {
  instanceName: string;
  displayName: string;
}) => {
  const [status, setStatus] = useState("loading");
  const [instanceId, setInstanceId] = useState("unknown");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      setError(null);
      const response = await fetch(
        `${API_BASE_URL}/manage-ec2?name=${instanceName}&action=status`,
      );
      const data = await response.json();
      if (response.ok) {
        setStatus(data.current_state);
        setInstanceId(data.instance_id || "unknown");
      } else {
        setError(data.error || "Failed to fetch status");
        setStatus("error");
      }
    } catch (err) {
      setError("Network error connecting to API");
      setStatus("error");
    }
  };

  const handleAction = async (actionType: action_i) => {
    setActionLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/manage-ec2?name=${instanceName}&action=${actionType}`,
      );
      const data = await response.json();
      if (response.ok) {
        setStatus(data.current_state || "updating");
        setTimeout(fetchStatus, 1500);
      } else {
        setError(data.error || `Failed to ${actionType} instance`);
      }
    } catch (err) {
      setError(`Network error trying to ${actionType}`);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [instanceName]);

  const getStatusStyles = () => {
    switch (status) {
      case "running":
        return {
          bg: "#052e16",
          border: "#22c55e",
          dot: "#22c55e",
          text: "#4ade80",
        };
      case "stopped":
        return {
          bg: "#450a0a",
          border: "#ef4444",
          dot: "#ef4444",
          text: "#f87171",
        };
      case "pending":
      case "stopping":
      case "rebooting":
        return {
          bg: "#422006",
          border: "#eab308",
          dot: "#eab308",
          text: "#facc15",
        };
      default:
        return {
          bg: "#1f2937",
          border: "#374151",
          dot: "#9ca3af",
          text: "#9ca3af",
        };
    }
  };

  const stylesColors = getStatusStyles();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: stylesColors.bg, borderColor: stylesColors.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.displayName}>{displayName}</Text>
        <TouchableOpacity onPress={fetchStatus} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.metaText}>
        Tag: {instanceName} • ID: {instanceId}
      </Text>

      <View style={styles.statusBox}>
        <View
          style={[styles.statusDot, { backgroundColor: stylesColors.dot }]}
        />
        <Text style={styles.statusLabel}>STATUS: </Text>
        <Text style={[styles.statusValue, { color: stylesColors.text }]}>
          {status.toUpperCase()}
        </Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      <View style={styles.btnGroup}>
        <TouchableOpacity
          disabled={
            actionLoading || status === "running" || status === "pending"
          }
          onPress={() => handleAction("start")}
          style={[
            styles.button,
            styles.startBtn,
            (actionLoading || status === "running" || status === "pending") &&
              styles.disabledBtn,
          ]}
        >
          <Text style={styles.btnText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={
            actionLoading || status === "stopped" || status === "stopping"
          }
          onPress={() => handleAction("stop")}
          style={[
            styles.button,
            styles.stopBtn,
            (actionLoading || status === "stopped" || status === "stopping") &&
              styles.disabledBtn,
          ]}
        >
          <Text style={styles.btnText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={
            actionLoading || status === "stopped" || status === "stopping"
          }
          onPress={() => handleAction("reboot")}
          style={[
            styles.button,
            styles.rebootBtn,
            (actionLoading || status === "stopped" || status === "stopping") &&
              styles.disabledBtn,
          ]}
        >
          <Text style={styles.btnText}>Reboot</Text>
        </TouchableOpacity>
      </View>
      {actionLoading && (
        <ActivityIndicator
          size="small"
          color="#fff"
          style={{ marginTop: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  displayName: { fontSize: 18, fontWeight: "bold", color: "#fff", flex: 1 },
  refreshButton: { padding: 6, backgroundColor: "#1e293b", borderRadius: 8 },
  refreshText: { fontSize: 16 },
  metaText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#94a3b8",
    marginVertical: 8,
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusLabel: { fontSize: 11, fontWeight: "bold", color: "#94a3b8" },
  statusValue: { fontSize: 13, fontWeight: "bold" },
  errorBox: {
    backgroundColor: "rgba(220,38,38,0.2)",
    padding: 8,
    borderRadius: 6,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#dc2626",
  },
  errorText: { color: "#f87171", fontSize: 12 },
  btnGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  startBtn: { backgroundColor: "#16a34a" },
  stopBtn: { backgroundColor: "#dc2626" },
  rebootBtn: { backgroundColor: "#475569" },
  disabledBtn: { backgroundColor: "#1e293b", opacity: 0.5 },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textTransform: "uppercase",
  },
});
