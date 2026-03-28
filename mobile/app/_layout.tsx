import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ProfileProvider, useProfile } from '@/constants/ProfileContext';
import { PoliciesProvider } from '@/constants/PoliciesContext';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { profile, isLoading } = useProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = segments[0] === 'onboarding';

    if (!profile && !inOnboarding) {
      router.replace('/onboarding');
    } else if (profile && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [profile, isLoading, segments]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0c1220' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="policy/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <ProfileProvider>
      <PoliciesProvider>
        <RootLayoutNav />
      </PoliciesProvider>
    </ProfileProvider>
  );
}
