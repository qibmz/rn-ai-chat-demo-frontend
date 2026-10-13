import { Box } from '@/components/ui/box';
import { useThemePreference } from '@/lib/theme/ThemeProvider';
import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from 'react-native';

/**
 * 勿给 TextInput 打 NativeWind className：
 * react-native-css deepMergeConfig 会在真机抛 TypeError: undefined is not a function。
 * 颜色用 StyleSheet + placeholderTextColor。
 */
const PALETTE = {
  light: {
    text: '#0a0a0a',
    placeholder: '#737373',
    muted: '#f5f5f5',
  },
  dark: {
    text: '#fafafa',
    placeholder: '#a1a1a1',
    muted: '#262626',
  },
} as const;

type CapsuleFieldProps = Omit<TextInputProps, 'style'> & {
  style?: StyleProp<TextStyle>;
  /** 外壳额外 className（只打在 Box 上，安全） */
  containerClassName?: string;
};

/** 与 AuthField 同视觉：h-14 / muted / 满圆角胶囊输入 */
export function CapsuleField({
  style,
  placeholderTextColor,
  containerClassName,
  ...props
}: CapsuleFieldProps) {
  const { resolved } = useThemePreference();
  const colors = PALETTE[resolved];

  return (
    <Box
      className={`h-14 w-full justify-center rounded-full border border-transparent px-5 shadow-none ${containerClassName ?? ''}`}
      style={{ backgroundColor: colors.muted }}>
      <TextInput
        {...props}
        placeholderTextColor={placeholderTextColor ?? colors.placeholder}
        style={StyleSheet.flatten([styles.input, { color: colors.text }, style])}
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 0,
    fontSize: 16,
    lineHeight: 22,
    textAlignVertical: 'center',
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
});
