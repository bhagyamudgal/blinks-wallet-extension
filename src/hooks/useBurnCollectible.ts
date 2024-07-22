import { Keypair } from "@solana/web3.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { burnCollectible } from "../libs/das";
import { useNftsTabViewStore } from "../store/nftsTabView";

type Data = {
    mint: string;
    wallet: string;
    keypair: Keypair;
};

export function useBurnCollectible() {
    const queryClient = useQueryClient();
    const { changeNftsTabView, setNftMint } = useNftsTabViewStore();

    return useMutation({
        mutationKey: ["burn-collectible"],
        mutationFn: (data: Data) => burnCollectible(data),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["wallet-nfts"] });
            setNftMint(null);
            changeNftsTabView("nfts");
        },
    });
}
