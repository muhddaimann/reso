import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function MoodTrend() {
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
        Mood Trend
      </Text>
      <View style={styles.graphRow}>
        {Array.from({ length: 7 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: wp("3%"),
              height: wp(`${20 + (i % 4) * 6}%`),
              borderRadius: wp("1%"),
              backgroundColor: theme.colors.primary,
              opacity: 0.3 + (i % 4) * 0.15,
            }}
          />
        ))}
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
  title: { fontSize: wp("4.4%"), fontWeight: "700", marginBottom: wp("3%") },
  graphRow: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: wp("2%"),
    flexDirection: "row",
  },
});
