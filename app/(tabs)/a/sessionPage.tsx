import UserCard from "@/components/b/userCard";
import { useTabVisibility } from "@/contexts/bottomContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Chip, Text, TextInput, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function SessionPage() {
  const theme = useTheme();
  const router = useRouter();
  const { setHideTabBar } = useTabVisibility();
  const scrollRef = useRef<ScrollView>(null);

  const { path, answers, questions } = useLocalSearchParams<{
    path?: string;
    answers?: string;
    questions?: string;
  }>();

  const parsedAnswers = useMemo(() => {
    try {
      return answers ? (JSON.parse(answers) as string[]) : [];
    } catch {
      return [];
    }
  }, [answers]);

  const parsedQuestions = useMemo(() => {
    try {
      return questions ? (JSON.parse(questions) as string[]) : [];
    } catch {
      return [];
    }
  }, [questions]);

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const extraQuestions = useMemo(
    () => ["What is your next step?", "What quote are you basing this on?"],
    []
  );

  const [nextStep, setNextStep] = useState("");
  const [quote, setQuote] = useState("");

  const handleComplete = () => {
    console.log("Session Complete");
    console.log("Next Step:", nextStep);
    console.log("Quote:", quote);
    router.back();
  };

  const handleFocus = () => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  const pathText = useMemo(() => {
    if (!path) return "Reviewing your session.";
    return `You chose to ${path} this thought.`;
  }, [path]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <UserCard showBack title="Session" />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            Session Recap
          </Text>
          {parsedQuestions.map((q, i) => (
            <View key={i} style={styles.recapItem}>
              <Text
                style={[
                  styles.recapQuestion,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {q}
              </Text>
              {i === 0 ? (
                <View style={styles.chipsContainer}>
                  {parsedAnswers[i]
                    .split(",")
                    .filter((f) => f.trim())
                    .map((feeling, idx) => (
                      <Chip
                        key={idx}
                        style={[
                          styles.chip,
                          { backgroundColor: theme.colors.primaryContainer },
                        ]}
                      >
                        {feeling}
                      </Chip>
                    ))}
                </View>
              ) : (
                <Text
                  style={[
                    styles.recapAnswer,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {parsedAnswers[i]?.trim() || "—"}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.headerRow}>
          <Text
            style={[
              styles.pathHeader,
              {
                color: theme.colors.onSurfaceVariant,
                backgroundColor: theme.colors.surfaceVariant,
              },
            ]}
          >
            {pathText}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
            Your Reflection
          </Text>
          <View>
            <Text
              style={[
                styles.inputLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {extraQuestions[0]}
            </Text>
            <TextInput
              mode="outlined"
              value={nextStep}
              onChangeText={setNextStep}
              placeholder="Describe your next actionable step."
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              multiline
              onFocus={handleFocus}
            />
          </View>
          <View>
            <Text
              style={[
                styles.inputLabel,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {extraQuestions[1]}
            </Text>
            <TextInput
              mode="outlined"
              value={quote}
              onChangeText={setQuote}
              placeholder="e.g., 'The journey of a thousand miles...'"
              style={styles.input}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              multiline
              onFocus={handleFocus}
            />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleComplete}
          disabled={!nextStep.trim() || !quote.trim()}
          style={styles.completeButton}
          contentStyle={{ paddingVertical: wp("1.5%") }}
          labelStyle={{ fontSize: wp("4%") }}
        >
          Complete Session
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp("4%"),
    paddingTop: wp("3%"),
    paddingBottom: wp("8%"),
    gap: wp("4%"),
  },
  headerRow: {
    alignItems: "center",
  },
  pathHeader: {
    fontSize: wp("3.8%"),
    textAlign: "center",
    paddingHorizontal: wp("4%"),
    paddingVertical: wp("2%"),
    borderRadius: wp("3%"),
    lineHeight: wp("5%"),
  },
  card: {
    borderRadius: wp("4%"),
    padding: wp("4%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    gap: wp("3%"),
  },
  cardTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
  },
  recapItem: {
    marginBottom: wp("2%"),
    gap: wp("1%"),
  },
  recapQuestion: {
    fontSize: wp("3.5%"),
    opacity: 0.8,
  },
  recapAnswer: {
    fontSize: wp("4%"),
    fontWeight: "500",
    lineHeight: wp("5.5%"),
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("2%"),
  },
  chip: {
    height: wp("8%"),
    justifyContent: "center",
    paddingHorizontal: wp("1%"),
  },
  inputLabel: {
    fontSize: wp("3.8%"),
    fontWeight: "500",
    marginBottom: wp("2%"),
  },
  input: {
    maxHeight: wp("28%"),
  },
  completeButton: {
    borderRadius: wp("3%"),
    marginTop: wp("2%"),
  },
});
