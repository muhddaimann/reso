import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type UserCardProps = {
  showBack?: boolean;
  title?: string;
};

export default function UserCard({
  showBack = false,
  title = "",
}: UserCardProps) {
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
      <View style={styles.row}>
        {showBack ? (
          <IconButton
            icon="chevron-left"
            size={wp("7%")}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          />
        ) : (
          <View style={{ width: wp("12%") }} />
        )}

        <View style={styles.right}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {title}
          </Text>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: wp("0%"),
    paddingHorizontal: wp("2%"),
    gap: wp("2%"),
  },
  right: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: wp("4%"),
  },
  title: {
    fontSize: wp("4.2%"),
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
