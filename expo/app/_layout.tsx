import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LegacyProvider } from "@/providers/LegacyProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: '#F5F5F5',
      },
      headerTintColor: '#4A4A4A',
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="questions" options={{ title: "Tu Historia" }} />
      <Stack.Screen name="review" options={{ title: "Revisar Respuestas" }} />
      <Stack.Screen name="pdf" options={{ title: "Crear Libro del Legado" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <LanguageProvider>
          <LegacyProvider>
            <RootLayoutNav />
          </LegacyProvider>
        </LanguageProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}