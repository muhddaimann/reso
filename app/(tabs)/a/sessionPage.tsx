import UserCard from "@/components/b/userCard";
import { useTabVisibility } from "@/contexts/bottomContext";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function SessionPage() {
  const theme = useTheme();
  const { setHideTabBar } = useTabVisibility();

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

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <UserCard showBack title="Session" />
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        <Text variant="titleLarge" style={{ marginBottom: wp("3%") }}>
          Session ({(path as string) || "—"})
        </Text>
        {parsedQuestions.map((q, i) => (
          <Card key={i} style={{ marginBottom: wp("3%") }}>
            <Card.Title title={`Q${i + 1}`} subtitle={q} />
            <Divider />
            <Card.Content>
              <Text style={{ marginTop: wp("2%") }}>
                {parsedAnswers[i] || "—"}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: wp("4%") },
});
