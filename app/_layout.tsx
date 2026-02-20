import { useState, useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(link);
}

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutNav() {
  const { user, isReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
    const t = setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 500);
    return () => clearTimeout(t);
  }, [user, segments, isReady]);

  return <Slot />;
}

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Esto mantiene el APK funcionando
        await Font.loadAsync({
          ...MaterialIcons.font,
          ...FontAwesome.font,
        });
      } catch (e) {
        console.warn('Error en fuentes:', e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  if (!appIsReady) return null;

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}