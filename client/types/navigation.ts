import { ClarityChoice } from "@/storage/localStorage";

export type RootStackParamList = {
  Splash: undefined;
  Question: undefined;
  Note: { choice: ClarityChoice };
  Confirmation: { choice: ClarityChoice };
  Locked: undefined;
  Patterns: undefined;
  PremiumGate: undefined;
};
