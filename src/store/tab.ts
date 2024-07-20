import { create } from "zustand";

type Tab = "nfts" | "settings";

type TabState = {
    tab: Tab;
    changeTab: (tab: Tab) => void;
};

export const useTabStore = create<TabState>((set) => ({
    tab: "nfts",
    changeTab: (tab) => set({ tab }),
}));
