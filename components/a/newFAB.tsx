import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  Divider,
  Modal,
  Portal,
  ProgressBar,
  SegmentedButtons,
  TextInput,
  useTheme,
} from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NewFABProps = {
  visible: boolean;
  extended: boolean;
  onPress?: () => void;
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

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState<"accept" | "fight">("accept");
  const QUESTIONS = [
    "What you feel right now?",
    "What’s on your mind?",
    "What happened?",
    "What triggers this?",
    "What else could be going on?",
    "What you assume?",
    "What’s the fact?",
  ];
  const TOTAL_STEPS = QUESTIONS.length + 1;
  const LAST_INDEX = TOTAL_STEPS - 1;

  const [answers, setAnswers] = useState<string[]>(
    Array.from({ length: QUESTIONS.length }, () => "")
  );

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

  const handleStart = () => {
    onPress?.();
    setOpen(true);
  };

  const resetState = () => {
    setStep(0);
    setPath("accept");
    setAnswers(Array.from({ length: QUESTIONS.length }, () => ""));
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const handleNext = () => setStep((s) => Math.min(LAST_INDEX, s + 1));
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleContinue = () => {
    setOpen(false);

    const params = {
      path,
      answers: JSON.stringify(answers),
      questions: JSON.stringify(QUESTIONS),
    };

    router.push({ pathname: "/(tabs)/a/sessionPage", params });

    resetState();
  };

  return (
    <>
      <Animated.View
        pointerEvents={visible ? "auto" : "none"}
        style={[
          styles.container,
          {
            bottom: insets.bottom + wp("20%"),
            right: wp("4%"),
            opacity: show,
          },
        ]}
      >
        <Pressable onPress={handleStart} style={{ borderRadius: RADIUS }}>
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

      <Portal>
        <Modal
          visible={open}
          onDismiss={handleClose}
          contentContainerStyle={[
            styles.modal,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outlineVariant,
            },
          ]}
        >
          <View style={styles.progressWrap}>
            <ProgressBar
              progress={(step + 1) / TOTAL_STEPS}
              color={theme.colors.primary}
              style={{ height: wp("1.6%"), borderRadius: wp("1%") }}
            />
            <Text
              style={[
                styles.stepText,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Step {step + 1} / {TOTAL_STEPS}
            </Text>
          </View>

          {step < QUESTIONS.length ? (
            <>
              <Text
                style={[styles.question, { color: theme.colors.onSurface }]}
              >
                {QUESTIONS[step]}
              </Text>
              <TextInput
                mode="outlined"
                multiline
                value={answers[step]}
                onChangeText={(t) =>
                  setAnswers((a) => {
                    const c = [...a];
                    c[step] = t;
                    return c;
                  })
                }
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                style={{ minHeight: wp("30%") }}
                placeholder="Type here..."
              />
            </>
          ) : (
            <>
              <Text
                style={[styles.question, { color: theme.colors.onSurface }]}
              >
                Choose your path
              </Text>
              <SegmentedButtons
                value={path}
                onValueChange={(v) => setPath(v as "accept" | "fight")}
                buttons={[
                  { value: "accept", label: "Accept" },
                  { value: "fight", label: "Fight" },
                ]}
              />
            </>
          )}

          <Divider style={{ marginVertical: wp("3%") }} />

          <View style={styles.actions}>
            <Button mode="text" onPress={handleBack} disabled={step === 0}>
              Back
            </Button>
            {step < LAST_INDEX ? (
              <Button mode="contained" onPress={handleNext}>
                Next
              </Button>
            ) : (
              <Button mode="contained" onPress={handleContinue}>
                Continue
              </Button>
            )}
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", zIndex: 30 },
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
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  modal: {
    marginHorizontal: wp("5%"),
    padding: wp("5%"),
    borderRadius: wp("4%"),
    borderWidth: 1,
  },
  progressWrap: { gap: wp("2%"), marginBottom: wp("3%") },
  stepText: { fontSize: wp("3.2%"), textAlign: "right" },
  question: { fontSize: wp("4.5%"), fontWeight: "700", marginBottom: wp("3%") },
  actions: {
    marginTop: wp("3%"),
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("3%"),
  },
});
