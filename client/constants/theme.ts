import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1A1A1A",
    textSecondary: "#6B6B6B",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B6B6B",
    tabIconSelected: "#1A1A1A",
    link: "#1A1A1A",
    backgroundRoot: "#FFFFFF",
    backgroundDefault: "#F8F8F8",
    backgroundSecondary: "#F0F0F0",
    backgroundTertiary: "#E8E8E8",
    success: "#2D2D2D",
  },
  dark: {
    text: "#FFFFFF",
    textSecondary: "#9A9A9A",
    buttonText: "#1A1A1A",
    tabIconDefault: "#9A9A9A",
    tabIconSelected: "#FFFFFF",
    link: "#FFFFFF",
    backgroundRoot: "#1A1A1A",
    backgroundDefault: "#252525",
    backgroundSecondary: "#2D2D2D",
    backgroundTertiary: "#353535",
    success: "#E0E0E0",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 80,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  none: 0,
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500" as const,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
