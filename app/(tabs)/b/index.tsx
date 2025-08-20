import AppAlert, { AppAlertProps } from "@/components/appAlert";
import { useToast } from "@/hooks/useToast";
import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

// Define the shape of the alert props, omitting the parts that will be controlled by the page
// This makes it easier to define our demo cases
type AlertDemoProps = Omit<AppAlertProps, "visible" | "onDismiss">;

export default function PageB() {
  const theme = useTheme();
  const { showToast } = useToast();

  // A single state to hold the props for the currently visible alert
  const [alertProps, setAlertProps] = useState<AlertDemoProps | null>(null);

  // --- Alert Definitions ---

  const simpleAlert: AlertDemoProps = {
    icon: "information-outline",
    title: "Session Saved",
    subtitle: "Your session has been successfully saved to your journal.",
    actions: [
      {
        text: "Got It",
        onPress: () => setAlertProps(null), // Simply dismiss the alert
      },
    ],
  };

  const confirmationAlert: AlertDemoProps = {
    icon: "help-circle-outline",
    title: "Delete Session?",
    subtitle: "This action cannot be undone. Are you sure you want to delete this?",
    actions: [
      {
        text: "Cancel",
        onPress: () => setAlertProps(null), // Dismiss
      },
      {
        text: "Delete",
        onPress: () => {
          showToast({ message: "Item deleted", type: "error" });
          setAlertProps(null); // Dismiss after action
        },
      },
    ],
  };

  const warningAlert: AlertDemoProps = {
    icon: "alert-circle-outline",
    title: "Unsaved Changes",
    subtitle: "You have unsaved changes. Are you sure you want to discard them?",
    actions: [
      {
        text: "Cancel",
        onPress: () => setAlertProps(null), // Dismiss
      },
      {
        text: "Discard",
        onPress: () => {
          showToast({ message: "Changes discarded" });
          setAlertProps(null); // Dismiss after action
        },
      },
    ],
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.container}
      >
        <Text style={[styles.pageTitle, { color: theme.colors.onSurface }]}>
          AppAlert Demos
        </Text>

        {/* Card 1: Simple Alert */}
        <Card style={styles.card}>
          <Card.Title title="Simple Alert" subtitle="1-button notification" />
          <Card.Content>
            <Button mode="contained" onPress={() => setAlertProps(simpleAlert)}>
              Show Simple Alert
            </Button>
          </Card.Content>
        </Card>

        {/* Card 2: Confirmation Alert */}
        <Card style={styles.card}>
          <Card.Title title="Confirmation Alert" subtitle="2-button confirmation" />
          <Card.Content>
            <Button mode="contained" onPress={() => setAlertProps(confirmationAlert)}>
              Show Confirmation
            </Button>
          </Card.Content>
        </Card>

        {/* Card 3: Warning Alert */}
        <Card style={styles.card}>
          <Card.Title title="Warning Alert" subtitle="2-button warning" />
          <Card.Content>
            <Button mode="contained" onPress={() => setAlertProps(warningAlert)}>
              Show Warning
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Render the AppAlert when alertProps is not null */}
      {alertProps && (
        <AppAlert
          visible={!!alertProps}
          onDismiss={() => setAlertProps(null)}
          {...alertProps}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: wp("4%"),
    gap: wp("4%"),
  },
  pageTitle: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: wp("2%"),
  },
  card: {
    width: "100%",
  },
});