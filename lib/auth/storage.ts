import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TokenPair } from '@/lib/api/types';

const ACCESS_KEY = 'auth.accessToken';
const REFRESH_KEY = 'auth.refreshToken';
const EXPIRES_KEY = 'auth.expiresIn';

export async function saveTokens(tokens: TokenPair): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, tokens.accessToken],
    [REFRESH_KEY, tokens.refreshToken],
    [EXPIRES_KEY, tokens.expiresIn],
  ]);
}

export async function loadTokens(): Promise<TokenPair | null> {
  const pairs = await AsyncStorage.multiGet([ACCESS_KEY, REFRESH_KEY, EXPIRES_KEY]);
  const map = Object.fromEntries(pairs);
  const accessToken = map[ACCESS_KEY];
  const refreshToken = map[REFRESH_KEY];
  if (!accessToken || !refreshToken) return null;
  return {
    accessToken,
    refreshToken,
    expiresIn: map[EXPIRES_KEY] || '',
  };
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, EXPIRES_KEY]);
}
