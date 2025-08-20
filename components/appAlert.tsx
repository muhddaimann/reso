import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type AppAlertAction = { text: string; onPress: () => void };

export type AppAlertProps = {
  visible: boolean;
  onDismiss: () => void;
  icon?: string;
  title: string;
  subtitle: string;
  actions: AppAlertAction[];
};

export default function AppAlert({
  visible,
  onDismiss,
  icon = "feather",
  title,
  subtitle,
  actions,
}: AppAlertProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(visible);

  const opacity = useRef(new Animated.Value(0)).current;
  const AnimatedBackdrop = useRef(
    Animated.createAnimatedComponent(Pressable)
  ).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, opacity]);

  if (!actions.length || actions.length > 2) return null;
  if (!mounted) return null;

  const closeThen = (fn?: () => void) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
        fn?.();
        onDismiss();
      }
    });
  };

  return (
    <Portal>
      <Modal
        visible={mounted}
        onDismiss={() => closeThen()}
        dismissable={false}
      >
        <AnimatedBackdrop
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: "rgba(0,0,0,0.0)", opacity },
          ]}
          onPress={() => closeThen()}
        />
        <View style={styles.center}>
          <Animated.View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
                shadowColor: "#000",
                opacity,
              },
            ]}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: theme.colors.primary + "22" },
              ]}
            >
              <MaterialCommunityIcons
                name={icon as any}
                size={wp("8.5%")}
                color={theme.colors.primary}
              />
            </View>

            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              {title}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {subtitle}
            </Text>

            <View style={styles.actionsRow}>
              {actions.length === 1 ? (
                <Button
                  mode="contained"
                  style={styles.btn}
                  onPress={() => closeThen(actions[0].onPress)}
                >
                  {actions[0].text}
                </Button>
              ) : (
                <>
                  <Button
                    mode="text"
                    style={styles.btn}
                    onPress={() => closeThen(actions[0].onPress)}
                  >
                    {actions[0].text}
                  </Button>
                  <Button
                    mode="contained"
                    style={styles.btn}
                    onPress={() => closeThen(actions[1].onPress)}
                  >
                    {actions[1].text}
                  </Button>
                </>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingHorizontal: wp("6%"),
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  card: {
    width: "100%",
    borderRadius: wp("4.5%"),
    paddingVertical: wp("6%"),
    paddingHorizontal: wp("5%"),
    borderWidth: StyleSheet.hairlineWidth,
    elevation: 4,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    alignItems: "center",
  },
  iconWrap: {
    width: wp("14%"),
    height: wp("14%"),
    borderRadius: wp("7%"),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: wp("3.5%"),
  },
  title: {
    fontSize: wp("5.2%"),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: wp("1.6%"),
  },
  subtitle: {
    fontSize: wp("3.9%"),
    textAlign: "center",
    lineHeight: wp("5.4%"),
    marginBottom: wp("5.5%"),
  },
  actionsRow: {
    flexDirection: "row",
    gap: wp("2.5%"),
    width: "100%",
    justifyContent: "flex-end",
  },
  btn: { flex: 1 },
});
