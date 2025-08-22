import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function CheckDraft() {
  const theme = useTheme();
  const draftCount: number = 2;
  const plural = draftCount === 1 ? "draft" : "drafts";

  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 6,
    }).start();

  return (
    <Pressable
      onPressIn={pressIn}
      onPressOut={pressOut}
      onPress={() => router.push("/(tabs)/a/draftPage")}
      accessibilityRole="button"
      accessibilityLabel="Open drafts"
      android_ripple={{ color: theme.colors.outline }}
      style={[styles.fill, { borderRadius: wp("5%"), overflow: "hidden" }]}
    >
      <Animated.View
        style={[
          styles.card,
          styles.fill,
          {
            backgroundColor: theme.colors.surfaceVariant,
            shadowColor: theme.colors.shadow,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.topRow}>
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            Drafts
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={wp("6.2%")}
            color={theme.colors.onSurfaceVariant}
          />
        </View>

        <View style={styles.center}>
          <Text style={[styles.count, { color: theme.colors.onSurface }]}>
            {draftCount}
          </Text>
          <Text
            style={[styles.caption, { color: theme.colors.onSurfaceVariant }]}
          >
            {plural} saved
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  card: {
    borderRadius: wp("5%"),
    padding: wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: wp("2%"),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: wp("4.2%"),
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: wp("1%"),
  },
  count: {
    fontSize: wp("16%"),
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: wp("16%"),
  },
  caption: {
    fontSize: wp("3.8%"),
    fontWeight: "600",
  },
});
