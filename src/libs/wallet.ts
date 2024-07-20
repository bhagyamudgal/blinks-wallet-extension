import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export function getWalletFromLocalStorage() {
    const walletSecretKey = localStorage.getItem("wallet-secret-key");

    if (walletSecretKey) {
        const decodedSecretKey = bs58.decode(walletSecretKey);

        return Keypair.fromSecretKey(decodedSecretKey);
    } else {
        return null;
    }
}

export function setWalletInLocalStorage(keypair: Keypair) {
    const walletSecretKey = bs58.encode(keypair.secretKey);

    return localStorage.setItem("wallet-secret-key", walletSecretKey);
}

export function shortenWalletAddress(address: string, chars = 4) {
    if (address) {
        return `${address.slice(0, chars)}...${address.slice(chars * -1)}`;
    }

    return null;
}
