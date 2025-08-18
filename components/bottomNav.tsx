import { useTabVisibility } from "@/contexts/bottomContext";
import { useEffect, useRef } from "react";
import { Animated, Easing, Platform, Pressable } from "react-native";
import { useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

function TabItem({ route, navigation, descriptors, isFocused }: any) {
  const theme = useTheme();
  const { options } = descriptors[route.key];
  const Icon = options.tabBarIcon;
  const label = options.title || route.name;
  const labelOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const labelTranslate = useRef(new Animated.Value(isFocused ? 0 : 10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(labelOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(labelTranslate, {
        toValue: isFocused ? 0 : 10,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused, labelOpacity, labelTranslate]);

  const onPress = () => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <Pressable
      key={route.key}
      onPress={onPress}
      style={{
        width: "45%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Icon &&
        Icon({
          color: isFocused ? theme.colors.primary : theme.colors.outline,
          size: wp("9%"),
        })}
      <Animated.Text
        style={{
          fontSize: wp("3.2%"),
          fontWeight: "500",
          color: theme.colors.primary,
          opacity: labelOpacity,
          transform: [{ translateY: labelTranslate }],
          marginTop: wp("0.8%"),
        }}
        numberOfLines={1}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}

export default function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: any) {
  const theme = useTheme();
  const { hideTabBar } = useTabVisibility();

  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: hideTabBar ? 0 : 1,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [hideTabBar, opacity]);

  return (
    <Animated.View
      style={{
        opacity,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.surface,
        height: wp("18%"),
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingTop: Platform.OS === "android" ? wp("3%") : wp("2%"),
        paddingBottom: wp("6%"),
        paddingHorizontal: wp("6%"),
        zIndex: 100,
      }}
    >
      {state.routes.slice(0, 2).map((route: any, index: number) => (
        <TabItem
          key={route.key}
          route={route}
          index={index}
          navigation={navigation}
          descriptors={descriptors}
          isFocused={state.index === index}
        />
      ))}
    </Animated.View>
  );
}
