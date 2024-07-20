import { useWalletNfts } from "../hooks/useWalletNfts";
import { useNftsTabViewStore } from "../store/nftsTabView";
import { useWalletStore } from "../store/wallet";

export function Nfts() {
    const { setNftMint, changeNftsTabView } = useNftsTabViewStore();
    const { address } = useWalletStore();

    const { isPending, data } = useWalletNfts({
        wallet: address,
    });

    if (isPending) {
        return <p>Loading...</p>;
    }

    if (data?.items?.length === 0) {
        return <p className="text-center">No NFTs found.</p>;
    }

    return (
        <div className="p-4 grid grid-cols-2 gap-4 flex-1">
            {data?.items?.map((item) => {
                return (
                    <button
                        className="space-y-1"
                        onClick={() => {
                            setNftMint(item.id);
                            changeNftsTabView("nft");
                        }}
                    >
                        <img
                            className="aspect-square"
                            src={item.content?.links?.image}
                            alt={item.content?.metadata?.name}
                        />

                        <p className="text-left font-medium">
                            {item.content?.metadata?.name}
                        </p>
                    </button>
                );
            })}
        </div>
    );
}
