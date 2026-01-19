import { ClarityChoice } from "@/storage/localStorage";

export type RootStackParamList = {
  Splash: undefined;
  Question: undefined;
  Confirmation: { choice: ClarityChoice };
  Locked: undefined;
  Patterns: undefined;
};
