import React, { useEffect, useRef } from "react";
import { Animated, View, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

function PulsingCard({ style }: { style?: ViewStyle }) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: theme.colors.surface,
          opacity,
          shadowColor: theme.colors.onSurface,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        },
        style,
      ]}
    />
  );
}

export default function SkeletonLoad({
  layout = [1],
  containerStyle,
  rowGap = wp("2%"),
  blockGap = wp("4%"),
  cardHeight = wp("60%"),
  cardRadius = wp("4%"),
}: {
  layout?: number[];
  containerStyle?: ViewStyle;
  rowGap?: number;
  blockGap?: number;
  cardHeight?: number;
  cardRadius?: number;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          gap: blockGap,
          backgroundColor: theme.colors.background,
        },
        containerStyle,
      ]}
    >
      {layout.map((count, r) => (
        <View key={r} style={{ flexDirection: "row", gap: rowGap }}>
          {Array.from({ length: count }).map((_, i) => (
            <PulsingCard
              key={`${r}-${i}`}
              style={{ flex: 1, height: cardHeight, borderRadius: cardRadius }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
