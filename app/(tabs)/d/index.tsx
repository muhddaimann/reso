import UserCard from "@/components/d/userCard";
import LogoutFAB from "@/components/logoutFAB";
import TopFAB from "@/components/topFAB";
import { APP_NAME, APP_VERSION } from "@/constants/env";
import { useTabVisibility } from "@/contexts/bottomContext";
import { useScrollDirection } from "@/hooks/useBottomNav";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { List, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function Settings() {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const { setHideTabBar } = useTabVisibility();
  const { direction, onScroll } = useScrollDirection();
  const [showFab, setShowTopFab] = useState(false);
  const [showLogoutFab, setShowLogoutFab] = useState(true);

  useEffect(() => {
    if (direction === "down") {
      setHideTabBar(true);
      setShowLogoutFab(false);
    } else if (direction === "up") {
      setHideTabBar(false);
      setShowLogoutFab(true);
    }
  }, [direction, setHideTabBar]);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowTopFab(y > wp("25%"));
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          onScroll(e);
          handleScroll(e);
        }}
        scrollEventThrottle={16}
      >
        <UserCard />

        <List.Section>
          <List.Subheader
            style={{
              color: theme.colors.onSurface,
              fontSize: wp("4.5%"),
              fontWeight: "600",
            }}
          >
            About
          </List.Subheader>

          <List.Item
            title="App"
            description={APP_NAME}
            left={(props) => <List.Icon {...props} icon="apps" />}
          />
          <List.Item
            title="Version"
            description={APP_VERSION}
            left={(props) => <List.Icon {...props} icon="tag-outline" />}
          />
        </List.Section>
      </ScrollView>

      <TopFAB visible={showFab} scrollRef={scrollRef} />
      <LogoutFAB visible={showLogoutFab} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: wp("10%"),
  },
});
