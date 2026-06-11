import { create } from "zustand";

type Tab = "all" | "income" | "expense";

type TabStore = {
  tab: Tab;
  setTab: (tab: Tab) => void;
};

export const useIncomeExpenseTabs = create<TabStore>((set) => ({
  tab: "all",
  setTab: (tab) => set({ tab }),
}));