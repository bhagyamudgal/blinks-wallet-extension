import { useWalletSolBalance } from "../hooks/useWalletSolBalance";
import { cn } from "../libs/style";
import { shortenWalletAddress } from "../libs/wallet";
import { useWalletStore } from "../store/wallet";
import CopyAddressButton from "./CopyAddressButton";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { TabsNav } from "./TabsNav";

export function Header() {
    const { address } = useWalletStore();

    const { isPending, data: solBalance } = useWalletSolBalance({
        wallet: address,
    });

    return (
        <header
            id="header"
            className={cn(
                "bg-card-background-dark p-4 space-y-4 sticky top-0 z-10",
                address && "pb-0"
            )}
        >
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-lg">Blinks Wallet</h1>

                {address && (
                    <div className="flex gap-4 items-center">
                        <span className="font-medium text-sm">
                            {shortenWalletAddress(address)}
                        </span>
                        <CopyAddressButton address={address} />
                    </div>
                )}
            </div>

            {address && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <span className="text-sm">SOL Balance</span>
                            <div className="flex items-center gap-2 font-bold text-3xl">
                                {isPending ? (
                                    <LoadingSkeleton className="w-3/4 h-8" />
                                ) : (
                                    <span>{solBalance} SOL</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <TabsNav />
                </div>
            )}
        </header>
    );
}
