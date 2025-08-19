import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Divider,
  Modal,
  Portal,
  ProgressBar,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

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

  useEffect(() => {
    if (open) {
      setStep(0);
      setPath("accept");
      setAnswers(Array.from({ length: QUESTIONS.length }, () => ""));
    }
  }, [open, QUESTIONS.length]);

  const handleNext = () => setStep((s) => Math.min(LAST_INDEX, s + 1));
  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleContinue = () => {
    onContinue({ path, answers, questions: QUESTIONS });
  };

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={onDismiss}
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
          <Text style={[styles.stepText, { color: theme.colors.onSurfaceVariant }]}>
            Step {step + 1} / {TOTAL_STEPS}
          </Text>
        </View>

        {step < QUESTIONS.length ? (
          <>
            <Text style={[styles.question, { color: theme.colors.onSurface }]}>
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
            <Text style={[styles.question, { color: theme.colors.onSurface }]}>
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
  );
}

const styles = StyleSheet.create({
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
