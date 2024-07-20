import { create } from "zustand";

type NftsTabView = "nfts" | "nft";

type NftsTabViewState = {
    nftsTabView: NftsTabView;
    nftMint: string | null;
    changeNftsTabView: (tab: NftsTabView) => void;
    setNftMint: (mint: string | null) => void;
};

export const useNftsTabViewStore = create<NftsTabViewState>((set) => ({
    nftsTabView: "nfts",
    nftMint: null,
    changeNftsTabView: (nftsTabView) => set({ nftsTabView }),
    setNftMint: (nftMint) => set({ nftMint }),
}));
