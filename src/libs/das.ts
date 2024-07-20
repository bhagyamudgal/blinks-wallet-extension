import { Network, ShyftSdk } from "@shyft-to/js";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { env } from "../env";
import type { Nft } from "../types";

export const shyft = new ShyftSdk({
    apiKey: env.SHYFT_API_KEY,
    network: Network.Mainnet,
});

export async function getWalletNfts(data: { wallet: string; page: number }) {
    const nfts = await shyft.rpc.getAssetsByOwner({
        ownerAddress: data.wallet,
        limit: 10,
        page: data.page,
    });

    console.log(nfts);

    for (const nft of nfts.items) {
        if (nft?.content?.files?.length === 0) {
            const res = (await fetch(nft?.content?.json_uri).then((data) =>
                data.json()
            )) as Nft;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            nft.content.links = {
                animation_url: res.animation_url,
                external_url: res.external_url,
                image: res.image,
            };

            nft.content.metadata = {
                name: res.name,
                symbol: res.symbol,
                attributes: res.attributes,
                description: res.description,
            };
        }
    }

    return nfts;
}

export async function getNft(data: { mint: string }) {
    const nft = await shyft.rpc.getAsset({
        id: data.mint,
    });

    if (nft?.content?.files?.length === 0) {
        const res = (await fetch(nft?.content?.json_uri).then((data) =>
            data.json()
        )) as Nft;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        nft.content.links = {
            animation_url: res.animation_url,
            external_url: res.external_url,
            image: res.image,
        };

        nft.content.metadata = {
            name: res.name,
            symbol: res.symbol,
            attributes: res.attributes,
            description: res.description,
        };
    }

    return nft;
}

export async function getWalletSolBalance(wallet: string) {
    const connection = new Connection(env.RPC_URL);

    const balance = await connection.getBalance(new PublicKey(wallet));

    return balance / LAMPORTS_PER_SOL;
}
