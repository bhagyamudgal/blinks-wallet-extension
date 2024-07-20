import { useQuery } from "@tanstack/react-query";
import { getWalletNfts } from "../libs/das";

type Data = { wallet: string | null };

async function fetchWalletNfts(data: Data) {
    if (!data.wallet) {
        return {
            items: [],
        };
    }

    const nfts = await getWalletNfts({ wallet: data.wallet, page: 1 });

    return nfts;
}

export function useWalletNfts(data: Data) {
    return useQuery({
        queryKey: ["wallet-nfts", data],
        queryFn: () => fetchWalletNfts(data),
        enabled: !!data.wallet,
    });
}
