import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function QuoteSuggest() {
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
        Quote
      </Text>
      <View style={styles.quoteBox}>
        <Text style={[styles.quote, { color: theme.colors.onSurface }]}>
          “The obstacle is the way.”
        </Text>
        <Text style={{ opacity: 0.6, marginTop: wp("2%") }}>— Marcus Aurelius</Text>
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
  quoteBox: {
    flex: 1,
    borderRadius: wp("3%"),
    padding: wp("3%"),
    justifyContent: "center",
  },
  quote: { fontSize: wp("5%"), fontWeight: "600", lineHeight: wp("7%") },
});
