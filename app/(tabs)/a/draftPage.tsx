import UserCard from "@/components/b/userCard";
import { useTabVisibility } from "@/contexts/bottomContext";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type Draft = {
  id: string;
  createdAt: number;
  path: "accept" | "fight";
  answers: string[];
  questions: string[];
};

const SAMPLE_QUESTIONS = [
  "What you feel right now?",
  "What’s on your mind?",
  "What happened?",
  "What triggers this?",
  "What else could be going on?",
  "What you assume?",
  "What’s the fact?",
];

const DRAFTS: Draft[] = [
  {
    id: "d1",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    path: "accept",
    answers: ["anxious, tense", "work piling up", "", "", "", "", ""],
    questions: SAMPLE_QUESTIONS,
  },
  {
    id: "d2",
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    path: "fight",
    answers: [
      "frustrated",
      "missed a deadline",
      "phone distraction",
      "context switching",
      "maybe unrealistic scope",
      "I must be perfect",
      "I submitted late once; it was fine",
    ],
    questions: SAMPLE_QUESTIONS,
  },
];

export default function DraftPage() {
  const theme = useTheme();
  const { setHideTabBar } = useTabVisibility();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const formatWhen = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleString();
  };

  const noDrafts = DRAFTS.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <UserCard showBack title="Drafts" />
      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {noDrafts ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.shadow,
              },
            ]}
          >
            <Text
              style={[styles.emptyTitle, { color: theme.colors.onSurface }]}
            >
              No drafts yet
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              Start a session to see saved drafts here.
            </Text>
          </View>
        ) : (
          DRAFTS.map((d, idx) => (
            <View
              key={d.id}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  shadowColor: theme.colors.shadow,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <Text
                  style={[styles.cardTitle, { color: theme.colors.onSurface }]}
                >
                  Draft {idx + 1}
                </Text>
                <Chip
                  style={{
                    backgroundColor:
                      d.path === "accept"
                        ? theme.colors.primaryContainer
                        : theme.colors.secondaryContainer,
                  }}
                  textStyle={{
                    color:
                      d.path === "accept"
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSecondaryContainer,
                    fontWeight: "700",
                  }}
                >
                  {d.path === "accept" ? "Accept" : "Fight"}
                </Chip>
              </View>

              <Text
                style={{
                  color: theme.colors.onSurfaceVariant,
                  marginBottom: wp("2%"),
                }}
              >
                {formatWhen(d.createdAt)}
              </Text>

              {d.questions.map((q, i) => (
                <View
                  key={`${d.id}-${i}`}
                  style={{ marginBottom: wp("2.5%"), gap: wp("1%") }}
                >
                  <Text
                    style={[styles.q, { color: theme.colors.onSurfaceVariant }]}
                  >
                    {q}
                  </Text>

                  {i === 0 ? (
                    <View style={styles.chipsWrap}>
                      {(d.answers[i] || "")
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((feel, k) => (
                          <Chip
                            key={`${d.id}-feel-${k}`}
                            style={{
                              backgroundColor: theme.colors.surfaceVariant,
                              height: wp("7.2%"),
                            }}
                          >
                            {feel}
                          </Chip>
                        ))}
                      {!d.answers[i] && (
                        <Text
                          style={{
                            color: theme.colors.onSurface,
                            opacity: 0.6,
                          }}
                        >
                          —
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text style={[styles.a, { color: theme.colors.onSurface }]}>
                      {d.answers[i]?.trim() || "—"}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp("4%"),
    paddingTop: wp("3%"),
    paddingBottom: wp("8%"),
    gap: wp("4%"),
  },
  card: {
    borderRadius: wp("4%"),
    padding: wp("4%"),
    gap: wp("1%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: wp("1%"),
  },
  cardTitle: {
    fontSize: wp("4.6%"),
    fontWeight: "800",
  },
  q: {
    fontSize: wp("3.6%"),
  },
  a: {
    fontSize: wp("4%"),
    fontWeight: "500",
    lineHeight: wp("5.4%"),
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: wp("2%"),
  },
  emptyCard: {
    borderRadius: wp("4%"),
    padding: wp("6%"),
    alignItems: "center",
    gap: wp("2%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: wp("5%"),
    fontWeight: "800",
  },
});
