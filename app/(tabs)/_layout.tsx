import AnimatedTabBar from "@/components/bottomNav";
import {
  TabVisibilityProvider,
  useTabVisibility,
} from "@/contexts/bottomContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";

function TabLayoutInner() {
  const theme = useTheme();
  const { hideTabBar } = useTabVisibility();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.surface }}
      edges={["top", "left", "right"]}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: wp("3.2%") },
        }}
        tabBar={(props) => (hideTabBar ? null : <AnimatedTabBar {...props} />)}
      >
        <Tabs.Screen
          name="a"
          options={{
            title: "Session",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                color={color}
                size={wp("6.5%")}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="b"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="cog-outline"
                color={color}
                size={wp("6.5%")}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

export default function TabLayout() {
  return (
    <TabVisibilityProvider>
      <TabLayoutInner />
    </TabVisibilityProvider>
  );
}
