import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function RoutineSuggest() {
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
        Suggested Routine
      </Text>
      <Text style={{ marginBottom: wp("4%"), opacity: 0.7 }}>
        3-min breathing • Box breath 4-4-4-4
      </Text>
      <Button mode="contained" onPress={() => {}}>
        Start
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: wp("4%"),
    padding: wp("4%"),
    justifyContent: "space-between",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  title: { fontSize: wp("4.2%"), fontWeight: "700", marginBottom: wp("2%") },
});
