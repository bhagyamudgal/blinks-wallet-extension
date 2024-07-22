import { useQuery } from "@tanstack/react-query";
import { getWalletSolBalance } from "../libs/das";

type Data = { wallet: string | null };

async function fetchWalletSolBalance(data: Data) {
    if (!data.wallet) {
        return null;
    }

    const balance = await getWalletSolBalance(data.wallet);

    return balance;
}

export function useWalletSolBalance(data: Data) {
    return useQuery({
        queryKey: ["wallet-sol-balance", data],
        queryFn: () => fetchWalletSolBalance(data),
        enabled: !!data.wallet,
        refetchInterval: 1000 * 60,
    });
}
