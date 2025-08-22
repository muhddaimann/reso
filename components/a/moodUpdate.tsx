import { Feeling, useMood } from "@/hooks/useMood";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type Props = {
  onPress?: () => void;
  currentMood?: Feeling;
  lastUpdated?: string;
};

export default function MoodUpdate({
  onPress,
  currentMood,
  lastUpdated,
}: Props) {
  const theme = useTheme();
  const { get } = useMood();
  const cfg = get(currentMood);

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
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Update mood"
      android_ripple={{ color: theme.colors.outline }}
      style={[styles.fill, { borderRadius: wp("5%"), overflow: "hidden" }]}
    >
      <Animated.View
        style={[
          styles.card,
          styles.fill,
          {
            backgroundColor: currentMood
              ? (cfg?.bg ?? theme.colors.surface)
              : theme.colors.surface,
            shadowColor: theme.colors.shadow,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.center}>
          <MaterialCommunityIcons
            name={(cfg?.icon as any) ?? "emoticon-outline"}
            size={wp("12%")}
            color={theme.colors.onSurface}
          />
          <Text style={[styles.prompt, { color: theme.colors.onSurface }]}>
            {currentMood
              ? `You're feeling ${currentMood}`
              : "Tap here to update what you feel"}
          </Text>
          {!!currentMood && (
            <Text
              style={[styles.caption, { color: theme.colors.onSurfaceVariant }]}
            >
              Last updated{lastUpdated ? ` • ${lastUpdated}` : ""}
            </Text>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, width: "100%", height: "100%" },
  card: {
    borderRadius: wp("5%"),
    padding: wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: wp("2%"),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: wp("2%"),
  },
  prompt: { fontSize: wp("4.4%"), fontWeight: "700", textAlign: "center" },
  caption: { fontSize: wp("3.4%"), fontWeight: "500" },
});
