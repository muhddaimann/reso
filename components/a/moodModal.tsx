import { Feeling, useMood } from "@/hooks/useMood";
import { useToast } from "@/hooks/useToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type Props = {
  open: boolean;
  onDismiss: () => void;
  onPick: (feeling: Feeling) => void;
};

export default function MoodModal({ open, onDismiss, onPick }: Props) {
  const theme = useTheme();
  const { list } = useMood();
  const { showToast } = useToast();

  const slideAnim = useRef(new Animated.Value(-1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(open);
  const [sheetH, setSheetH] = useState(0);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
    } else if (shouldRender) {
      const off = sheetH ? -sheetH : -300;
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: off,
          duration: 220,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => setShouldRender(false));
    }
  }, [open, shouldRender, sheetH, opacityAnim, slideAnim]);

  useEffect(() => {
    if (!shouldRender || !open || sheetH <= 0) return;
    slideAnim.setValue(-sheetH);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [shouldRender, open, sheetH, opacityAnim, slideAnim]);

  if (!shouldRender) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />
        <Animated.View
          onLayout={(e) => setSheetH(e.nativeEvent.layout.height)}
          style={[
            styles.sheetTop,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outlineVariant,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.onSurface }]}>
            How do you feel?
          </Text>

          <View style={styles.grid}>
            {list.map((f) => (
              <Pressable
                key={f.key}
                onPress={() => {
                  onPick(f.key);
                  const line =
                    f.lines[Math.floor(Math.random() * f.lines.length)];
                  showToast({
                    message: line,
                    type: "info",
                    bg: f.bg,
                    fg: theme.colors.onSurface,
                  });
                  onDismiss();
                }}
                android_ripple={{ color: theme.colors.outline }}
                style={[styles.item, { backgroundColor: f.bg }]}
                accessibilityRole="button"
                accessibilityLabel={`Select ${f.key}`}
              >
                <MaterialCommunityIcons
                  name={f.icon as any}
                  size={wp("8%")}
                  color={theme.colors.onSurface}
                />
                <Text
                  style={[
                    styles.itemText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {f.key}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 999,
  },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheetTop: {
    borderBottomLeftRadius: wp("4%"),
    borderBottomRightRadius: wp("4%"),
    paddingHorizontal: wp("5%"),
    paddingBottom: wp("4%"),
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "800",
    marginBottom: wp("3%"),
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: wp("2%"),
  },
  item: {
    width: "48%",
    height: wp("22%"),
    borderRadius: wp("3.5%"),
    alignItems: "center",
    justifyContent: "center",
    gap: wp("1.5%"),
  },
  itemText: { fontSize: wp("3.8%"), fontWeight: "700" },
});
