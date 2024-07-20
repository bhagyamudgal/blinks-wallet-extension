import { Keypair } from "@solana/web3.js";
import { setWalletInLocalStorage } from "../libs/wallet";
import { useWalletStore } from "../store/wallet";

export function CreateWallet() {
    const { setAddress, setKeypair } = useWalletStore();

    function createWalletHandler() {
        const keypair = Keypair.generate();
        setWalletInLocalStorage(keypair);
        setAddress(keypair.publicKey.toBase58());
        setKeypair(keypair);
    }

    return (
        <div className="bg-blue-200 flex items-center justify-center flex-1">
            <button
                className="bg-blue-500 text-white p-2 rounded-lg"
                onClick={createWalletHandler}
            >
                Create Wallet
            </button>
        </div>
    );
}
