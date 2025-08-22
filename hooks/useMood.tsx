import { useMemo } from "react";
import { useTheme } from "react-native-paper";

export type Feeling =
  | "Happy"
  | "Calm"
  | "Worried"
  | "Stressed"
  | "Frustrated"
  | "Sad";

type MoodStyle = {
  icon: string;
  bg: string;
  score: number;
  lines: string[];
};

type MoodConfig = Record<Feeling, MoodStyle>;

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const b =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const num = parseInt(b, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

const mix = (a: string, b: string, t: number) => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: Math.round(ca.r + (cb.r - ca.r) * t),
    g: Math.round(ca.g + (cb.g - ca.g) * t),
    b: Math.round(ca.b + (cb.b - ca.b) * t),
  });
};

export function useMood() {
  const theme = useTheme();

  const SPECTRUM: Feeling[] = useMemo(
    () => ["Happy", "Calm", "Worried", "Stressed", "Frustrated", "Sad"],
    []
  );

  const gradientStops = useMemo(() => {
    const start = theme.colors.secondaryContainer;
    const end = theme.colors.primaryContainer;
    const tMap: Record<Feeling, number> = {
      Happy: 1.0,
      Calm: 0.8,
      Worried: 0.6,
      Stressed: 0.4,
      Frustrated: 0.2,
      Sad: 0.0,
    };
    const bgMap: Record<Feeling, string> = {} as any;
    (Object.keys(tMap) as Feeling[]).forEach((k) => {
      bgMap[k] = mix(start, end, tMap[k]);
    });
    return bgMap;
  }, [theme.colors.primaryContainer, theme.colors.secondaryContainer]);

  const config: MoodConfig = useMemo(() => {
    const base: Record<
      Feeling,
      { icon: string; score: number; lines: string[] }
    > = {
      Happy: {
        icon: "emoticon-happy-outline",
        score: 1,
        lines: ["Feeling great!", "Keep it up!", "What made you happy?"],
      },
      Calm: {
        icon: "emoticon-neutral-outline",
        score: 2,
        lines: ["Peaceful moment.", "Stay balanced.", "Enjoy the calmness."],
      },
      Worried: {
        icon: "emoticon-confused-outline",
        score: 3,
        lines: ["Something on your mind?", "It’s okay to pause.", "Breathe."],
      },
      Stressed: {
        icon: "emoticon-neutral",
        score: 4,
        lines: ["Feeling tense?", "Take it step by step.", "You got this."],
      },
      Frustrated: {
        icon: "emoticon-angry-outline",
        score: 5,
        lines: ["It’s tough right now.", "Let it out safely.", "Slow down."],
      },
      Sad: {
        icon: "emoticon-sad-outline",
        score: 6,
        lines: ["It’s okay to be sad.", "Be gentle with yourself.", "Rest."],
      },
    };

    const entries = (Object.keys(base) as Feeling[]).map((k) => {
      const bg = gradientStops[k];
      return [
        k,
        {
          icon: base[k].icon,
          bg,
          score: base[k].score,
          lines: base[k].lines,
        },
      ] as const;
    });

    return Object.fromEntries(entries) as MoodConfig;
  }, [gradientStops]);

  const list = useMemo(
    () => SPECTRUM.map((k) => ({ key: k, ...config[k] })),
    [SPECTRUM, config]
  );

  const get = (mood?: Feeling | null) => (mood ? config[mood] : undefined);

  return { config, list, get, SPECTRUM };
}
