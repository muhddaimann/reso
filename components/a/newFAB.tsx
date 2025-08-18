import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NewFABProps = {
  visible: boolean;
  extended: boolean;
  onPress: () => void;
};

export default function NewFAB({ visible, extended, onPress }: NewFABProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const HEIGHT = wp("13.5%");
  const RADIUS = HEIGHT / 2;
  const DEFAULT_W = wp("32%");
  const MAX_W = wp("40%");

  const [contentW, setContentW] = useState<number | null>(null);
  const targetW = Math.min(
    Math.max(DEFAULT_W, (contentW ?? 0) + wp("6%")),
    MAX_W
  );

  const show = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const progress = useRef(new Animated.Value(extended ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(show, {
      toValue: visible ? 1 : 0,
      duration: 160,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, show]);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: extended ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [extended, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [HEIGHT, targetW],
  });

  const labelOpacity = progress;
  const labelTranslate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 0],
  });

  const iconCenterOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      pointerEvents={visible ? "auto" : "none"}
      style={[
        styles.container,
        {
          bottom: insets.bottom + wp("18%"),
          right: wp("4%"),
          opacity: show,
        },
      ]}
    >
      <Pressable onPress={onPress} style={{ borderRadius: RADIUS }}>
        <Animated.View
          style={[
            styles.fab,
            {
              backgroundColor: theme.colors.primary,
              width,
              height: HEIGHT,
              borderRadius: RADIUS,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View style={StyleSheet.absoluteFillObject as any}>
            <Animated.View
              style={[styles.center, { opacity: iconCenterOpacity }]}
            >
              <MaterialCommunityIcons
                name="plus"
                color={theme.colors.onPrimary}
                size={wp("6%")}
              />
            </Animated.View>
          </View>

          <Animated.View
            style={[
              styles.row,
              {
                opacity: labelOpacity,
                transform: [{ translateX: labelTranslate }],
              },
            ]}
          >
            <Text
              numberOfLines={1}
              style={[styles.label, { color: theme.colors.onPrimary }]}
            >
              Let it out
            </Text>
            <View style={styles.iconRight}>
              <MaterialCommunityIcons
                name="plus"
                color={theme.colors.onPrimary}
                size={wp("6%")}
              />
            </View>
          </Animated.View>

          <View
            style={styles.measureRow}
            onLayout={(e) => setContentW(e.nativeEvent.layout.width)}
          >
            <Text style={styles.label}>Let it out</Text>
            <View style={styles.iconRight} />
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 30,
  },
  fab: {
    paddingHorizontal: wp("4%"),
    elevation: 8,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    justifyContent: "center",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: wp("2%"),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconRight: {
    width: wp("6.8%"),
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: wp("3.8%"),
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  measureRow: {
    position: "absolute",
    opacity: 0,
    left: -9999,
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
});
