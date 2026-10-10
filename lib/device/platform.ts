import { Platform } from 'react-native';

/** 原生 App（iOS / Android）；Web / H5 为 false */
export const isNativeApp = Platform.OS === 'ios' || Platform.OS === 'android';
