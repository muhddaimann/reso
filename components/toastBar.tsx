import { useToast } from "@/hooks/useToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const hexToRgba = (hex: string, alpha = 1) => {
  if (!hex) return `rgba(0,0,0,${alpha})`;
  let c = hex.replace("#", "");
  if (c.length === 3)
    c = c
      .split("")
      .map((ch) => ch + ch)
      .join("");
  const r = parseInt(c.slice(0, 2), 16) || 0;
  const g = parseInt(c.slice(2, 4), 16) || 0;
  const b = parseInt(c.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ToastBar() {
  const { toast, hideToast } = useToast();
  const theme = useTheme();

  const translate = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.timing(translate, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translate, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(hideToast);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [toast, hideToast, opacity, translate]);

  if (!toast) return null;

  const type = toast.type ?? "custom";

  const palette = {
    success: {
      bg: theme.colors.primaryContainer,
      fg: theme.colors.onPrimaryContainer,
    },
    error: {
      bg: theme.colors.errorContainer,
      fg: theme.colors.onErrorContainer,
    },
    info: {
      bg: theme.colors.secondaryContainer,
      fg: theme.colors.onSecondaryContainer,
    },
    custom: {
      bg: theme.colors.surfaceVariant,
      fg: theme.colors.onSurfaceVariant,
    },
  } as const;

  const base = (palette as any)[type] ?? palette.custom;

  const current = {
    bg: toast.bg ?? base.bg,
    fg: toast.fg ?? base.fg,
  };

  const iconName =
    type === "success"
      ? "check-circle"
      : type === "error"
        ? "alert-circle"
        : type === "info"
          ? "information"
          : "bell";

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: hexToRgba(current.bg, 0.88),
          transform: [{ translateY: translate }],
          opacity,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <View style={styles.icon}>
        <MaterialCommunityIcons
          name={iconName}
          size={hp("2.2%")}
          color={current.fg}
        />
      </View>
      <Text style={[styles.text, { color: current.fg }]}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: hp("6.4%"),
    paddingBottom: hp("1.5%"),
    paddingHorizontal: hp("2%"),
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: wp("1%"),
    borderBottomRightRadius: wp("1%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    zIndex: 6,
  },
  icon: { marginRight: wp("2.5%") },
  text: { fontSize: hp("1.5%"), fontWeight: "500", flex: 1 },
});
