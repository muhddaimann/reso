import ToastBar from "@/components/toastBar";
import { AuthProvider } from "@/contexts/authContext";
import { ThemeProvider, useToggle } from "@/contexts/themeContext";
import { ToastProvider } from "@/hooks/useToast";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Provider as PaperProvider } from "react-native-paper";

function LayoutWithTheme() {
  const { theme } = useToggle();
  return (
    <PaperProvider theme={theme}>
      <StatusBar
        style={theme.dark ? "light" : "dark"}
        backgroundColor={theme.colors.surface}
      />
      <AuthProvider>
        <ToastProvider>
          <Slot />
          <ToastBar />
        </ToastProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LayoutWithTheme />
    </ThemeProvider>
  );
}
