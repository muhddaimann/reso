import { useToast } from "@/hooks/useToast";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Button,
  Divider,
  ProgressBar,
  SegmentedButtons,
  TextInput,
  useTheme,
} from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const screenHeight = Dimensions.get("window").height;

type Props = {
  open: boolean;
  onDismiss: () => void;
  onContinue: (payload: {
    path: "accept" | "fight";
    answers: string[];
    questions: string[];
  }) => void;
};

export default function NewModal({ open, onDismiss, onContinue }: Props) {
  const theme = useTheme();
  const { showToast } = useToast();
  const QUESTIONS = useMemo(
    () => [
      "What you feel right now?",
      "What’s on your mind?",
      "What happened?",
      "What triggers this?",
      "What else could be going on?",
      "What you assume?",
      "What’s the fact?",
    ],
    []
  );
  const TOTAL_STEPS = QUESTIONS.length + 1;
  const LAST_INDEX = TOTAL_STEPS - 1;

  const [step, setStep] = useState(0);
  const [path, setPath] = useState<"accept" | "fight">("accept");
  const [answers, setAnswers] = useState<string[]>(
    Array.from({ length: QUESTIONS.length }, () => "")
  );

  const inputRef = useRef<any>(null);

  const slideAnim = useRef(new Animated.Value(-screenHeight)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setStep(0);
      setPath("accept");
      setAnswers(Array.from({ length: QUESTIONS.length }, () => ""));
      slideAnim.setValue(-screenHeight);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (inputRef.current) inputRef.current.focus();
      });
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenHeight,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
      ]).start(() => setShouldRender(false));
    }
  }, [open, QUESTIONS.length, opacityAnim, slideAnim]);

  useEffect(() => {
    if (!open) return;
    const task = InteractionManager.runAfterInteractions(() => {
      if (inputRef.current && step < QUESTIONS.length) {
        inputRef.current.focus();
      }
    });
    return () => {
      // @ts-ignore RN types
      task?.cancel?.();
    };
  }, [open, step, QUESTIONS.length]);

  const handleNext = () => setStep((s) => Math.min(LAST_INDEX, s + 1));
  const handleBack = () => setStep((s) => Math.max(0, s - 1));
  const handleContinue = () =>
    onContinue({ path, answers, questions: QUESTIONS });

  const handleSaveDraft = () => {
    showToast({ message: "Saved to draft, check Home.", type: "success" });
    onDismiss();
  };

  const atLast = step >= QUESTIONS.length;
  const canNext = atLast || !!answers[step]?.trim();
  const hasInput = useMemo(
    () => answers.some((a) => a.trim() !== ""),
    [answers]
  );

  if (!shouldRender) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[styles.overlay, { opacity: opacityAnim }]}>
        <Pressable
          style={styles.backdrop}
          onPress={() => {
            if (!hasInput) {
              onDismiss();
            }
          }}
        />

        <Animated.View
          style={[
            styles.sheetTop,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outlineVariant,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            bounces={false}
            overScrollMode="never"
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: wp("3%") }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerRow}>
              <MaterialCommunityIcons
                name="feather"
                size={wp("8%")}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.headerActions}>
                <Button
                  mode="text"
                  onPress={handleSaveDraft}
                  style={styles.headerButton}
                  disabled={!hasInput}
                >
                  Save Draft
                </Button>
                <Button
                  mode="outlined"
                  onPress={onDismiss}
                  style={[
                    styles.headerButton,
                    !hasInput && { borderColor: theme.colors.error },
                  ]}
                  disabled={hasInput}
                  textColor={!hasInput ? theme.colors.error : undefined}
                >
                  Close
                </Button>
              </View>
            </View>

            {!atLast ? (
              <>
                <Text
                  style={[styles.question, { color: theme.colors.onSurface }]}
                >
                  {QUESTIONS[step]}
                </Text>
                <TextInput
                  ref={inputRef}
                  mode="outlined"
                  multiline
                  autoFocus
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
                  textAlignVertical="top"
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

            <View style={styles.actions}>
              <Button mode="text" onPress={handleBack} disabled={step === 0}>
                Back
              </Button>
              {!atLast ? (
                <Button
                  mode="contained"
                  onPress={handleNext}
                  disabled={!canNext}
                >
                  Next
                </Button>
              ) : (
                <Button mode="contained" onPress={handleContinue}>
                  Continue
                </Button>
              )}
            </View>
          </ScrollView>
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetTop: {
    borderBottomLeftRadius: wp("4%"),
    borderBottomRightRadius: wp("4%"),
    paddingTop: wp("4%"),
    paddingHorizontal: wp("5%"),
    maxHeight: screenHeight * 0.75,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: wp("4%"),
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    borderRadius: wp("4%"),
  },
  progressWrap: { gap: wp("2%"), marginTop: wp("2%") },
  stepText: { fontSize: wp("3.2%"), textAlign: "right" },
  question: { fontSize: wp("4.5%"), fontWeight: "700", marginBottom: wp("3%") },
  actions: {
    marginTop: wp("3%"),
    flexDirection: "row",
    justifyContent: "space-between",
    gap: wp("3%"),
  },
});
