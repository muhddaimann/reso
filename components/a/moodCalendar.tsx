import { useMood } from "@/hooks/useMood";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function MoodCalendar() {
  const theme = useTheme();
  const { list } = useMood();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const intensities = [1, 3, 2, 4, 5, 2, 1];
``
  const today = new Date();
  const jsDay = today.getDay();
  const mondayIndex = (jsDay + 6) % 7;
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - mondayIndex);

  const weekDates = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const seededRand = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const moodBGs = list.map((m) => m.bg);
  const neutral = theme.colors.surfaceVariant;

  return (
    <View style={styles.card}>
      <View style={styles.weekRow}>
        {days.map((d, i) => {
          const dateObj = weekDates[i];
          const isToday = isSameDate(dateObj, today);
          const isPastOrToday =
            dateObj <=
            new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const opacity = 0.25 + intensities[i] * 0.12;

          const seed = Math.floor(startOfWeek.getTime() / 86400000) + i;
          const randIdx =
            moodBGs.length > 0
              ? Math.floor(seededRand(seed) * moodBGs.length)
              : 0;

          const dotColor = isPastOrToday
            ? (moodBGs[randIdx] ?? neutral)
            : neutral;

          return (
            <View key={`${d}-${i}`} style={styles.day}>
              <Text
                style={[
                  styles.dayLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {d}
              </Text>

              <View
                style={[
                  styles.dateCircle,
                  {
                    borderColor: isToday
                      ? theme.colors.primary
                      : theme.colors.outlineVariant,
                    borderWidth: isToday ? 2 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    {
                      color: isToday
                        ? theme.colors.primary
                        : theme.colors.onSurface,
                    },
                  ]}
                >
                  {dateObj.getDate()}
                </Text>
              </View>

              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: dotColor,
                    opacity: isPastOrToday ? opacity : 1,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const DOT_SIZE = wp("2.2%");
const DATE_SIZE = wp("8.5%");

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: wp("4%"),
    gap: wp("2%"),
  },
  weekRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: wp("1%"),
    width: "100%",
  },
  day: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: wp("1%"),
  },
  dayLabel: {
    fontSize: wp("3.2%"),
    letterSpacing: 0.5,
  },
  dateCircle: {
    width: DATE_SIZE,
    height: DATE_SIZE,
    borderRadius: DATE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: wp("3.8%"),
    fontWeight: "700",
  },
  dot: {
    marginTop: wp("1%"),
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
