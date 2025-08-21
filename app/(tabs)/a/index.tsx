import MoodTrend from "@/components/a/a";
import TopTrigger from "@/components/a/b";
import RoutineSuggest from "@/components/a/c";
import QuoteSuggest from "@/components/a/d";
import NewFAB from "@/components/a/newFAB";
import NewModal from "@/components/a/newModal";
import UserCard from "@/components/a/userCard";
import SkeletonLoad from "@/components/skeletonLoad";
import TopFAB from "@/components/topFAB";
import { useTabVisibility } from "@/contexts/bottomContext";
import { useScrollDirection } from "@/hooks/useBottomNav";
import { useToast } from "@/hooks/useToast";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function Home() {
  const theme = useTheme();
  const { direction, onScroll } = useScrollDirection();
  const { setHideTabBar } = useTabVisibility();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [showFab, setShowFab] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNewFab] = useState(true);
  const [isNewFabExtended, setIsNewFabExtended] = useState(true);
  const [openSession, setOpenSession] = useState(false);

  useEffect(() => {
    if (direction === "down") setHideTabBar(true);
    if (direction === "up") setHideTabBar(false);
  }, [direction, setHideTabBar]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast({ message: "Home data refreshed!", type: "success" });
    }, 800);
  }, [showToast]);

  const handleSessionContinue = ({
    path,
    answers,
    questions,
  }: {
    path: "accept" | "fight";
    answers: string[];
    questions: string[];
  }) => {
    const params = {
      path,
      answers: JSON.stringify(answers),
      questions: JSON.stringify(questions),
    };
    setOpenSession(false);
    router.push({ pathname: "/(tabs)/a/sessionPage", params });
  };

  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowFab(scrollY > wp("25%"));
    setIsNewFabExtended(scrollY < 10);
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={{ backgroundColor: theme.colors.surface }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          onScroll(e);
          handleScroll(e);
        }}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View
          style={[styles.full, { backgroundColor: theme.colors.background }]}
        >
          <UserCard />
          <View style={styles.body}>
            {loading ? (
              <SkeletonLoad layout={[2, 2]} />
            ) : (
              <View style={styles.grid}>
                <View style={styles.col}>
                  <View style={styles.blockTall}>
                    <MoodTrend />
                  </View>
                  <View style={styles.blockShort}>
                    <RoutineSuggest />
                  </View>
                  <View style={styles.blockTall}>
                    <MoodTrend />
                  </View>
                </View>
                <View style={styles.col}>
                  <View style={styles.blockShort}>
                    <TopTrigger />
                  </View>
                  <View style={styles.blockTall}>
                    <QuoteSuggest />
                  </View>
                  <View style={styles.blockShort}>
                    <MoodTrend />
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TopFAB visible={showFab} scrollRef={scrollRef} />
      <NewFAB
        visible={showNewFab}
        extended={isNewFabExtended}
        onPress={() => setOpenSession(true)}
      />
      <NewModal
        open={openSession}
        onDismiss={() => setOpenSession(false)}
        onContinue={handleSessionContinue}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  full: {
    flex: 1,
    paddingBottom: Platform.OS === "android" ? wp("10%") : wp("26%"),
  },
  body: { width: "100%", paddingHorizontal: wp("4%") },
  grid: { flexDirection: "row", gap: wp("4%") },
  col: { flex: 1, gap: wp("4%") },
  blockTall: {
    height: wp("60%"),
    borderRadius: wp("4%"),
    overflow: "hidden",
  },
  blockShort: {
    height: wp("50%"),
    borderRadius: wp("4%"),
    overflow: "hidden",
  },
});
