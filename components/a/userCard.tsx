import { StyleSheet, View } from "react-native";
import { Avatar, IconButton, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function UserCard() {
  const theme = useTheme();
  const shortName = "User";
  const initial = shortName.charAt(0).toUpperCase();

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
      <View style={styles.row}>
        <View style={styles.left}>
          <Avatar.Text
            size={wp("12%")}
            label={initial}
            color={theme.colors.onPrimaryContainer}
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
          <View style={styles.texts}>
            <Text
              style={[styles.greet, { color: theme.colors.onSurfaceVariant }]}
            >
              How are you today,
            </Text>
            <Text style={[styles.name, { color: theme.colors.onSurface }]}>
              {shortName}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <IconButton
            icon="sync"
            size={wp("6.5%")}
            iconColor={theme.colors.onBackground}
            containerColor={theme.colors.background}
            onPress={() => {}}
          />
          <IconButton
            icon="bell-outline"
            size={wp("6.5%")}
            iconColor={theme.colors.onBackground}
            containerColor={theme.colors.background}
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderBottomLeftRadius: wp("4%"),
    borderBottomRightRadius: wp("4%"),
    marginBottom: wp("3%"),
    padding: wp("4%"),
    paddingBottom: wp("3%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: wp("4%"),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("4%"),
    flex: 1,
  },
  texts: {
    gap: wp("1%"),
  },
  greet: {
    fontSize: wp("3.6%"),
  },
  name: {
    fontSize: wp("5%"),
    fontWeight: "700",
    lineHeight: wp("6%"),
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
});
