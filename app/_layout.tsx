import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider } from '@/lib/auth/AuthProvider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <GluestackUIProvider mode="light">
            <AuthProvider>
              <StatusBar style="dark" />
              <Slot />
            </AuthProvider>
          </GluestackUIProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
