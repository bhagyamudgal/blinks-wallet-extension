import { useQuery } from "@tanstack/react-query";
import { getNft } from "../libs/das";

type Data = { mint: string | null };

async function fetchNft(data: Data) {
    if (!data.mint) {
        return null;
    }

    const nfts = await getNft({ mint: data.mint });

    return nfts;
}

export function useNft(data: Data) {
    return useQuery({
        queryKey: ["nft", data],
        queryFn: () => fetchNft(data),
        enabled: !!data.mint,
    });
}
