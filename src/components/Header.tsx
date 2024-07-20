import { useWalletSolBalance } from "../hooks/useWalletSolBalance";
import { shortenWalletAddress } from "../libs/wallet";
import { useWalletStore } from "../store/wallet";

export function Header() {
    const { address } = useWalletStore();

    const { isPending, data: solBalance } = useWalletSolBalance({
        wallet: address,
    });

    return (
        <header
            id="header"
            className="bg-blue-200 p-4 space-y-4 sticky top-0 z-10"
        >
            <h1 className="text-center font-bold">Blinks Wallet</h1>

            {address && (
                <div className="space-y-2">
                    <div>SOL: {isPending ? "Loading..." : solBalance}</div>
                    <div className="flex gap-4 items-center">
                        <span>{shortenWalletAddress(address)}</span>
                        <button
                            className="bg-blue-500 text-white p-2 rounded-lg text-sm"
                            onClick={() => {
                                navigator.clipboard.writeText(address);
                            }}
                        >
                            Copy Address
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
