import "@dialectlabs/blinks/index.css";
import { useAction } from "@dialectlabs/blinks/react";
import { IoArrowBackOutline } from "react-icons/io5";
import { env } from "../env";
import { useNft } from "../hooks/useNft";
import { useNftsTabViewStore } from "../store/nftsTabView";
import { Blink } from "./Blink";
import { LoadingSkeleton } from "./LoadingSkeleton";

export function Nft() {
    const { nftMint, setNftMint, changeNftsTabView } = useNftsTabViewStore();
    const { isPending, data } = useNft({ mint: nftMint });

    const actionUrl = data?.content?.links?.external_url ?? "";

    console.log({ actionUrl });

    const { action } = useAction(actionUrl, {
        rpcUrlOrConnection: env.RPC_URL,
    });

    console.log({ action });

    const name = data?.content?.metadata?.name;

    if (isPending) {
        return (
            <div className="space-y-2 p-6">
                <LoadingSkeleton className="h-72 w-full" />

                <LoadingSkeleton className="h-4 w-1/2" />
                <LoadingSkeleton className="h-10 w-3/4" />
            </div>
        );
    }

    return (
        <div>
            <div className="p-4">
                <button
                    className="flex gap-2 items-center text-xl font-medium group"
                    onClick={() => {
                        changeNftsTabView("nfts");
                        setNftMint(null);
                    }}
                >
                    <IoArrowBackOutline />{" "}
                    {name ? (
                        <span className="group-hover:underline underline-offset-4">
                            {name}
                        </span>
                    ) : (
                        <span>
                            <LoadingSkeleton className="w-1/2" />
                        </span>
                    )}
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
                        <p className="font-bold text-sm">
                            {data?.content?.metadata?.symbol}
                        </p>
                    </div>

                    <p className="text-sm">
                        {data?.content?.metadata?.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4">
                        {data?.content?.metadata?.attributes?.map((attr) => {
                            return (
                                <div className="flex flex-col space-y-2 bg-card-background-dark rounded-lg p-4">
                                    <span className="font-bold">
                                        {attr.trait_type}
                                    </span>
                                    <span className="text-sm">
                                        {attr.value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
