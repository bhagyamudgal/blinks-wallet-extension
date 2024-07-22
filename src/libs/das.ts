import { Network, ShyftSdk } from "@shyft-to/js";
import {
    ComputeBudgetProgram,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
    type Keypair,
} from "@solana/web3.js";
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

export async function burnCollectible(data: {
    mint: string;
    wallet: string;
    keypair: Keypair;
}) {
    const nft = await shyft.rpc.getAsset({
        id: data.mint,
    });

    let encodedTx;

    if (nft?.compression) {
        const burnRes = await shyft.nft.compressed.burn({
            mint: data.mint,
            walletAddress: data.wallet,
        });

        encodedTx = burnRes.encoded_transaction;
    } else {
        encodedTx = await shyft.nft.burn({
            mint: data.mint,
            wallet: data.wallet,
        });
    }

    if (!encodedTx) {
        throw new Error("Failed to get the transaction!");
    }

    const connection = new Connection(env.RPC_URL, "confirmed");

    console.log({ connection });

    const block = await connection.getLatestBlockhash({
        commitment: "confirmed",
    });

    console.log({ block });

    const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1,
    });

    const tx = Transaction.from(Buffer.from(encodedTx, "base64"));

    tx.add(addPriorityFee);
    tx.feePayer = data.keypair.publicKey;
    tx.recentBlockhash = block.blockhash;

    console.log({ tx });

    tx.sign(data.keypair);

    const txSig = await sendAndConfirmTransaction(
        connection,
        tx,
        [data.keypair],
        {
            commitment: "confirmed",
        }
    );

    console.log({ txSig });

    return txSig;
}
