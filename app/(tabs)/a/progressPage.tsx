import UserCard from "@/components/b/userCard";
import { useTabVisibility } from "@/contexts/bottomContext";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type Session = {
  id: string;
  createdAt: number;
  path: "accept" | "fight";
  answers: string[]; // same structure as SessionPage
  questions: string[]; // same 7 questions
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

// Mock sessions (replace with real data from store/API)
const SESSIONS: Session[] = [
  {
    id: "s1",
    createdAt: Date.now() - 1000 * 60 * 60 * 6, // 6h ago
    path: "accept",
    answers: ["anxious, tense", "work piling up", "", "", "", "", ""],
    questions: SAMPLE_QUESTIONS,
  },
  {
    id: "s2",
    createdAt: Date.now() - 1000 * 60 * 60 * 30, // 30h ago
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
  {
    id: "s3",
    createdAt: Date.now() - 1000 * 60 * 60 * 60, // 60h ago
    path: "accept",
    answers: ["drained", "too many meetings", "", "", "", "", ""],
    questions: SAMPLE_QUESTIONS,
  },
];

export default function ProgressPage() {
  const theme = useTheme();
  const { setHideTabBar } = useTabVisibility();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  const formatWhen = (ts: number) => new Date(ts).toLocaleString();

  // ------- Stats -------
  const { totalSessions, totalThoughts, acceptCount, fightCount, activeDays } =
    useMemo(() => {
      const totalSessions = SESSIONS.length;

      const totalThoughts = SESSIONS.reduce((sum, s) => {
        const answered = s.answers.filter((a) => a && a.trim().length > 0);
        return sum + answered.length;
      }, 0);

      const acceptCount = SESSIONS.filter((s) => s.path === "accept").length;
      const fightCount = totalSessions - acceptCount;

      const dayKey = (ts: number) => {
        const d = new Date(ts);
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
        // simple y-m-d key
      };
      const activeDays = new Set(SESSIONS.map((s) => dayKey(s.createdAt))).size;

      return {
        totalSessions,
        totalThoughts,
        acceptCount,
        fightCount,
        activeDays,
      };
    }, []);

  const noSessions = SESSIONS.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <UserCard showBack title="Progress" />

      <ScrollView
        contentContainerStyle={styles.content}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Stats */}
        <View
          style={[
            styles.statsCard,
            {
              backgroundColor: theme.colors.surface,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <Text style={[styles.statsTitle, { color: theme.colors.onSurface }]}>
            Keep going — you’re making progress ✨
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text
                style={[styles.statNumber, { color: theme.colors.onSurface }]}
              >
                {totalThoughts}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                thoughts logged
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text
                style={[styles.statNumber, { color: theme.colors.onSurface }]}
              >
                {totalSessions}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                sessions completed
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text
                style={[styles.statNumber, { color: theme.colors.onSurface }]}
              >
                {activeDays}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                active days
              </Text>
            </View>
          </View>

          <View style={styles.pathRow}>
            <Chip
              style={{
                backgroundColor: theme.colors.primaryContainer,
                height: wp("7.2%"),
              }}
              textStyle={{
                color: theme.colors.onPrimaryContainer,
                fontWeight: "700",
              }}
            >
              Accept: {acceptCount}
            </Chip>
            <Chip
              style={{
                backgroundColor: theme.colors.secondaryContainer,
                height: wp("7.2%"),
              }}
              textStyle={{
                color: theme.colors.onSecondaryContainer,
                fontWeight: "700",
              }}
            >
              Fight: {fightCount}
            </Chip>
          </View>
        </View>

        {/* Empty / Sessions List */}
        {noSessions ? (
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
              No progress yet
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              Start a session to see your progress here.
            </Text>
          </View>
        ) : (
          SESSIONS.map((s, idx) => {
            const answeredCount = s.answers.filter((a) => a?.trim()).length;
            return (
              <View
                key={s.id}
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
                    style={[
                      styles.cardTitle,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    Session {idx + 1}
                  </Text>
                  <Chip
                    style={{
                      backgroundColor:
                        s.path === "accept"
                          ? theme.colors.primaryContainer
                          : theme.colors.secondaryContainer,
                    }}
                    textStyle={{
                      color:
                        s.path === "accept"
                          ? theme.colors.onPrimaryContainer
                          : theme.colors.onSecondaryContainer,
                      fontWeight: "700",
                    }}
                  >
                    {s.path === "accept" ? "Accept" : "Fight"}
                  </Chip>
                </View>

                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginBottom: wp("2%"),
                  }}
                >
                  {formatWhen(s.createdAt)} • {answeredCount}/
                  {s.questions.length} answered
                </Text>

                {/* Feelings chips for Q1 */}
                <View style={{ marginBottom: wp("2%") }}>
                  <Text
                    style={[styles.q, { color: theme.colors.onSurfaceVariant }]}
                  >
                    {s.questions[0]}
                  </Text>
                  <View style={styles.chipsWrap}>
                    {(s.answers[0] || "")
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((feel, k) => (
                        <Chip
                          key={`${s.id}-feel-${k}`}
                          style={{
                            backgroundColor: theme.colors.surfaceVariant,
                            height: wp("7.2%"),
                          }}
                        >
                          {feel}
                        </Chip>
                      ))}
                    {!s.answers[0] && (
                      <Text
                        style={{ color: theme.colors.onSurface, opacity: 0.6 }}
                      >
                        —
                      </Text>
                    )}
                  </View>
                </View>

                {/* Brief preview: Q2 + Q3 */}
                {[1, 2].map((i) => (
                  <View
                    key={`${s.id}-${i}`}
                    style={{ marginBottom: wp("2%"), gap: wp("1%") }}
                  >
                    <Text
                      style={[
                        styles.q,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {s.questions[i]}
                    </Text>
                    <Text style={[styles.a, { color: theme.colors.onSurface }]}>
                      {s.answers[i]?.trim() || "—"}
                    </Text>
                  </View>
                ))}
              </View>
            );
          })
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
  // Header stats
  statsCard: {
    borderRadius: wp("4%"),
    padding: wp("4%"),
    gap: wp("3%"),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  statsTitle: {
    fontSize: wp("4.6%"),
    fontWeight: "800",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("3%"),
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    gap: wp("0.8%"),
  },
  statNumber: {
    fontSize: wp("7.2%"),
    fontWeight: "900",
    letterSpacing: -0.2,
    lineHeight: wp("7.2%"),
  },
  statLabel: {
    fontSize: wp("3.4%"),
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: "70%",
    opacity: 0.08,
    backgroundColor: "#000",
  },
  pathRow: {
    flexDirection: "row",
    gap: wp("2%"),
  },

  // Session cards
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

  // Empty
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
