import { create } from "zustand";
import type { BasicInfoInput } from "@/schemas/assessment.schema";

interface WizardState {
  step: number;
  basicInfo: BasicInfoInput | null;
  problemIds: string[];
  setBasicInfo: (info: BasicInfoInput) => void;
  setProblemIds: (ids: string[]) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
}

const initial = {
  step: 1,
  basicInfo: null,
  problemIds: [] as string[],
};

export const useWizardStore = create<WizardState>((set) => ({
  ...initial,
  setBasicInfo: (basicInfo) => set({ basicInfo }),
  setProblemIds: (problemIds) => set({ problemIds }),
  next: () => set((state) => ({ step: Math.min(state.step + 1, 3) })),
  prev: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  reset: () => set(initial),
}));
