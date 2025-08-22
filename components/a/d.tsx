import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function QuoteSuggest() {
  const theme = useTheme();
  return (
    <View style={styles.card}>
      <View style={styles.quoteBox}>
        <Text style={[styles.quote, { color: theme.colors.onBackground }]}>
          “The obstacle is the way.”
        </Text>
        <Text
          style={[
            styles.by,
            {
              color: theme.colors.onPrimaryContainer,
            },
          ]}
        >
          — Marcus Aurelius
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: wp("2%"),
  },
  quoteBox: {
    flex: 1,
    justifyContent: "center",
  },
  quote: { fontSize: wp("8%"), fontWeight: "600", lineHeight: wp("8%") },
  by: {
    fontSize: wp("4%"),
    fontWeight: "600",
    marginTop: wp("2%"),
  },
});
