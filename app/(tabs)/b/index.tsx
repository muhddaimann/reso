import UserCard from "@/components/c/userCard";
import TopFAB from "@/components/topFAB";
import { useTabVisibility } from "@/contexts/bottomContext";
import { useScrollDirection } from "@/hooks/useBottomNav";
import React, { useEffect, useRef, useState } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Divider, List, Switch, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function Settings() {
  const theme = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const { setHideTabBar } = useTabVisibility();
  const { direction, onScroll } = useScrollDirection();
  const [showFab, setShowFab] = useState(false);
  const [useDeviceTheme, setUseDeviceTheme] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [shareAnalytics, setShareAnalytics] = useState(false);

  useEffect(() => {
    if (direction === "down") setHideTabBar(true);
    if (direction === "up") setHideTabBar(false);
  }, [direction, setHideTabBar]);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowFab(y > wp("25%"));
  };

  return (
    <>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          onScroll(e);
          handleScroll(e);
        }}
        scrollEventThrottle={16}
      >
        <UserCard />

        <View style={styles.body}>
          <List.Section>
            <List.Subheader>Account</List.Subheader>
            <List.Item
              title="Profile"
              description="Name, avatar, handle"
              left={(p) => <List.Icon {...p} icon="account-circle-outline" />}
              onPress={() => {}}
            />
            <List.Item
              title="Email & Phone"
              description="Manage contact information"
              left={(p) => <List.Icon {...p} icon="email-outline" />}
              onPress={() => {}}
            />
            <List.Item
              title="Change password"
              left={(p) => <List.Icon {...p} icon="lock-outline" />}
              onPress={() => {}}
            />
            <List.Item
              title="Subscription"
              description="Plan and billing"
              left={(p) => <List.Icon {...p} icon="credit-card-outline" />}
              onPress={() => {}}
            />
          </List.Section>

          <Divider />

          <List.Section>
            <List.Subheader>Appearance</List.Subheader>
            <List.Item
              title="Use device theme"
              left={(p) => <List.Icon {...p} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={useDeviceTheme}
                  onValueChange={(v) => setUseDeviceTheme(v)}
                />
              )}
            />
            <List.Item
              title="Dark mode"
              left={(p) => <List.Icon {...p} icon="weather-night" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={(v) => setDarkMode(v)}
                  disabled={useDeviceTheme}
                />
              )}
            />
          </List.Section>

          <Divider />

          <List.Section>
            <List.Subheader>Notifications</List.Subheader>
            <List.Item
              title="Reminders"
              description="Daily check-ins and tasks"
              left={(p) => <List.Icon {...p} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={notifReminders}
                  onValueChange={(v) => setNotifReminders(v)}
                />
              )}
            />
            <List.Item
              title="Tips & inspiration"
              description="Occasional content and quotes"
              left={(p) => <List.Icon {...p} icon="lightbulb-on-outline" />}
              right={() => (
                <Switch
                  value={notifMarketing}
                  onValueChange={(v) => setNotifMarketing(v)}
                />
              )}
            />
          </List.Section>

          <Divider />

          <List.Section>
            <List.Subheader>Privacy</List.Subheader>
            <List.Item
              title="Share anonymized analytics"
              description="Helps improve the app"
              left={(p) => <List.Icon {...p} icon="shield-check-outline" />}
              right={() => (
                <Switch
                  value={shareAnalytics}
                  onValueChange={(v) => setShareAnalytics(v)}
                />
              )}
            />
            <List.Item
              title="Export data"
              left={(p) => <List.Icon {...p} icon="download-outline" />}
              onPress={() => {}}
            />
            <List.Item
              title="Delete data"
              titleStyle={{ color: theme.colors.error }}
              left={(p) => (
                <List.Icon
                  {...p}
                  color={theme.colors.error}
                  icon="trash-can-outline"
                />
              )}
              onPress={() => {}}
            />
          </List.Section>

          <Divider />

          <List.Section>
            <List.Subheader>About</List.Subheader>
            <List.Item
              title="Rate the app"
              left={(p) => <List.Icon {...p} icon="star-outline" />}
              onPress={() => Linking.openURL("https://example.com/rate")}
            />
            <List.Item
              title="Privacy Policy"
              left={(p) => <List.Icon {...p} icon="file-document-outline" />}
              onPress={() => Linking.openURL("https://example.com/privacy")}
            />
            <List.Item
              title="Terms of Service"
              left={(p) => (
                <List.Icon {...p} icon="file-document-edit-outline" />
              )}
              onPress={() => Linking.openURL("https://example.com/terms")}
            />
            <List.Item
              title="Version"
              description="1.0.0 (100)"
              left={(p) => <List.Icon {...p} icon="information-outline" />}
            />
            <List.Item
              title="Sign out"
              titleStyle={{ color: theme.colors.error }}
              left={(p) => (
                <List.Icon {...p} color={theme.colors.error} icon="logout" />
              )}
              onPress={() => {}}
            />
          </List.Section>
        </View>
      </ScrollView>

      <TopFAB visible={showFab} scrollRef={scrollRef} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: wp("10%"),
  },
  body: {
    width: "100%",
    paddingHorizontal: wp("2%"),
  },
});
