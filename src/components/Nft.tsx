import "@dialectlabs/blinks/index.css";
import { useAction } from "@dialectlabs/blinks/react";
import { IoArrowBackOutline } from "react-icons/io5";
import { env } from "../env";
import { useNft } from "../hooks/useNft";
import { useNftsTabViewStore } from "../store/nftsTabView";
import { Blink } from "./Blink";

export function Nft() {
    const { nftMint, setNftMint, changeNftsTabView } = useNftsTabViewStore();
    const { isPending, data } = useNft({ mint: nftMint });

    const actionUrl = data?.content?.links?.external_url ?? "";

    console.log({ actionUrl });

    const { action } = useAction(actionUrl, {
        rpcUrlOrConnection: env.RPC_URL,
    });

    console.log({ action });

    if (isPending) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <div className="bg-blue-400 p-4">
                <button
                    className="flex gap-2 items-center"
                    onClick={() => {
                        changeNftsTabView("nfts");
                        setNftMint(null);
                    }}
                >
                    <IoArrowBackOutline /> Back
                </button>
            </div>

            {action && data ? (
                <Blink action={action} nft={data} />
            ) : (
                <div className="space-y-2 p-6">
                    <img
                        className="aspect-square"
                        src={data?.content?.links?.image}
                        alt={data?.content?.metadata?.name}
                    />

                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold">
                            {data?.content?.metadata?.name}
                        </h1>
                        <p className="font-medium text-sm">
                            {data?.content?.metadata?.symbol}
                        </p>
                    </div>

                    <p className="text-sm">
                        {data?.content?.metadata?.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4">
                        {data?.content?.metadata?.attributes?.map((attr) => {
                            return (
                                <div className="flex flex-col space-y-2 bg-blue-400 rounded-lg p-4">
                                    <span className="font-medium text-lg">
                                        {attr.trait_type}
                                    </span>
                                    <span>{attr.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
