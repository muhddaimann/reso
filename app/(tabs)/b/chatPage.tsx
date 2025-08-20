import UserCard from "@/components/b/userCard";
import { useTabVisibility } from "@/contexts/bottomContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Message = {
  role: "system" | "user";
  text: string;
};

export default function ChatPage() {
  const theme = useTheme();
  const { setHideTabBar } = useTabVisibility();
  const scrollRef = useRef<ScrollView>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", text: "Hello! How can I help you today?" },
  ]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setHideTabBar(true);
    return () => setHideTabBar(false);
  }, [setHideTabBar]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleSend = () => {
    const val = input.trim();
    if (!val) return;
    setMessages((prev) => [...prev, { role: "user", text: val }]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <UserCard showBack title="Chat" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={wp("15%")}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          bounces={false}
          alwaysBounceVertical={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m, idx) =>
            m.role === "system" ? (
              <View key={idx} style={styles.leftRow}>
                <Text
                  style={[
                    styles.sender,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  System
                </Text>
                <View
                  style={[
                    styles.bubble,
                    styles.leftBubble,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.outlineVariant,
                    },
                  ]}
                >
                  <Text style={{ color: theme.colors.onSurface }}>
                    {m.text}
                  </Text>
                </View>
              </View>
            ) : (
              <View key={idx} style={styles.rightRow}>
                <Text
                  style={[
                    styles.senderRight,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  You
                </Text>
                <View
                  style={[
                    styles.bubble,
                    styles.rightBubble,
                    { backgroundColor: theme.colors.primary },
                  ]}
                >
                  <Text style={{ color: theme.colors.onPrimary }}>
                    {m.text}
                  </Text>
                </View>
              </View>
            )
          )}
        </ScrollView>

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outlineVariant,
              paddingBottom: insets.bottom === 0 ? wp("3%") : insets.bottom,
            },
          ]}
        >
          <TextInput
            mode="outlined"
            value={input}
            onChangeText={setInput}
            placeholder="Type a message"
            style={styles.input}
            outlineColor={theme.colors.outline}
            activeOutlineColor={theme.colors.primary}
            multiline
          />
          <IconButton
            icon="send"
            size={wp("7%")}
            iconColor={theme.colors.onPrimary}
            containerColor={theme.colors.primary}
            onPress={handleSend}
            disabled={!input.trim()}
            style={styles.sendBtn}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: wp("4%"),
    paddingTop: wp("3%"),
    paddingBottom: wp("3%"),
    gap: wp("2%"),
  },
  leftRow: {
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  rightRow: {
    alignSelf: "flex-end",
    maxWidth: "85%",
  },
  sender: {
    fontSize: wp("3%"),
    marginBottom: wp("1%"),
  },
  senderRight: {
    fontSize: wp("3%"),
    textAlign: "right",
    marginBottom: wp("1%"),
  },
  bubble: {
    paddingHorizontal: wp("3.5%"),
    paddingVertical: wp("2.8%"),
    borderRadius: wp("3.5%"),
    borderWidth: StyleSheet.hairlineWidth,
  },
  leftBubble: {
    borderTopLeftRadius: wp("1.5%"),
  },
  rightBubble: {
    borderTopRightRadius: wp("1.5%"),
  },
  inputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: wp("2%"),
    paddingHorizontal: wp("3%"),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp("2%"),
  },
  input: {
    flex: 1,
    maxHeight: wp("24%"),
  },
  sendBtn: {
    borderRadius: wp("3%"),
  },
});
