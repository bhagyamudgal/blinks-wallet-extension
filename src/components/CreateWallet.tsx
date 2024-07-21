import { Keypair } from "@solana/web3.js";
import { setWalletInLocalStorage } from "../libs/wallet";
import { useWalletStore } from "../store/wallet";
import { Button } from "./Button";

export function CreateWallet() {
    const { setAddress, setKeypair } = useWalletStore();

    function createWalletHandler() {
        const keypair = Keypair.generate();
        setWalletInLocalStorage(keypair);
        setAddress(keypair.publicKey.toBase58());
        setKeypair(keypair);
    }

    return (
        <div className="flex flex-col items-center justify-center text-center gap-4 flex-1 p-4">
            <p className="text-lg">Please create a wallet to continue.</p>
            <Button className="w-1/2" onClick={createWalletHandler}>
                Create Wallet
            </Button>
        </div>
    );
}
