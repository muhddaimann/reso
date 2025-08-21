import { StyleSheet, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function TopTrigger() {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.onSurface }]}>
        Top Trigger
      </Text>
      <View style={styles.chips}>
        <Chip style={{ backgroundColor: theme.colors.surfaceVariant }}>
          Workload
        </Chip>
        <Chip style={{ backgroundColor: theme.colors.surfaceVariant }}>
          Sleep
        </Chip>
        <Chip style={{ backgroundColor: theme.colors.surfaceVariant }}>
          Money
        </Chip>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: wp("4%"),
    padding: wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  title: { fontSize: wp("4.2%"), fontWeight: "700", marginBottom: wp("3%") },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: wp("2%") },
});
