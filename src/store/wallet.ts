import type { Keypair } from "@solana/web3.js";
import { create } from "zustand";
import { getWalletFromLocalStorage } from "../libs/wallet";

type WalletState = {
    address: string | null;
    keypair: Keypair | null;
    setAddress: (address: string | null) => void;
    setKeypair: (keypair: Keypair | null) => void;
};

export const useWalletStore = create<WalletState>((set) => ({
    address: getWalletFromLocalStorage()?.publicKey.toBase58() || null,
    keypair: getWalletFromLocalStorage(),
    setAddress: (address) => set({ address }),
    setKeypair: (keypair) => set({ keypair }),
}));
