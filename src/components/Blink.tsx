import type { Action, ActionComponent } from "@dialectlabs/blinks";
import type { DAS } from "@shyft-to/js";
import { Connection, Transaction } from "@solana/web3.js";
import { Buffer } from "buffer";
import { useState } from "react";
import ReactPlayer from "react-player";
import { env } from "../env";
import { cn } from "../libs/style";
import { useWalletStore } from "../store/wallet";

export function Blink({
    action,
    nft,
}: {
    action: Action;
    nft: DAS.GetAssetResponse;
}) {
    const { address, keypair } = useWalletStore();

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [txSig, setTxSig] = useState<string | null>(null);

    const video_url = nft.content?.metadata.attributes?.find(
        (att) => att.trait_type === "video_url"
    )?.value;

    if (!address || !keypair) {
        return null;
    }

    async function handleActionPost(a: ActionComponent, value?: string) {
        if (!address || !keypair) {
            return null;
        }

        setIsLoading((prev) => ({ ...prev, [a.label]: true }));
        try {
            setError(null);

            if (value) {
                a.setValue(value, a.parameter.name);
            }

            const res = await a.post(address);

            console.log({ res });

            if (!res.message) {
                throw new Error("Something went wrong");
            }

            const connection = new Connection(env.RPC_URL, "confirmed");

            console.log({ connection });

            const block = await connection.getLatestBlockhash({
                commitment: "confirmed",
            });

            console.log({ block });

            const tx = Transaction.from(Buffer.from(res.transaction, "base64"));

            tx.feePayer = keypair.publicKey;
            tx.recentBlockhash = block.blockhash;

            console.log({ tx });

            tx.sign(keypair);

            const txSig = await connection.sendRawTransaction(tx.serialize(), {
                skipPreflight: true,
            });

            console.log({ txSig });

            const confirmResult = await connection.confirmTransaction({
                blockhash: block.blockhash,
                lastValidBlockHeight: block.lastValidBlockHeight,
                signature: txSig,
            });

            if (confirmResult.value.err) {
                throw new Error(confirmResult.value.err.toString());
            }

            setSuccess(res.message);
            setTxSig(txSig);
        } catch (error) {
            console.log({ error });
            setSuccess(null);
            setError(
                action.error ||
                    "An error occurred while processing your request. Please try again later."
            );
        }
        setIsLoading((prev) => ({ ...prev, [a.label]: false }));
    }

    return (
        <div className="space-y-2 p-4">
            {success && video_url && txSig ? (
                <ReactPlayer
                    url={`${video_url}?txSig=${txSig}`}
                    style={{
                        width: "100%",
                    }}
                    width={360}
                    controls={true}
                    playing={true}
                />
            ) : (
                <img
                    src={action.icon}
                    alt={action.title}
                    className="aspect-square"
                />
            )}

            <h1 className="text-xl font-bold">{action.title}</h1>
            <p>{action.description}</p>

            {action.actions?.map((a) => {
                if (!a?.parameter) {
                    return (
                        <button
                            disabled={
                                isLoading[a.label] ||
                                action.disabled ||
                                !!success
                            }
                            className={cn(
                                "bg-blue-500 text-white p-2 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-70"
                            )}
                            onClick={() => handleActionPost(a)}
                        >
                            {isLoading[a.label] ? "Loading..." : a.label}
                        </button>
                    );
                } else {
                    return (
                        <form
                            onSubmit={(form) => {
                                form.preventDefault();
                                const input = document.getElementById(
                                    `input-${a.parameter.name}`
                                ) as HTMLInputElement | null;

                                if (!input) {
                                    return;
                                }

                                const value = input.value;

                                handleActionPost(a, value);
                            }}
                            className="space-y-2"
                        >
                            <input
                                className="w-full border p-2 border-blue-400 rounded-md space-y-2"
                                placeholder={a.parameter.label}
                                name={a.parameter.name}
                                id={`input-${a.parameter.name}`}
                                required={a.parameter.required}
                            />

                            <button
                                type="submit"
                                disabled={
                                    isLoading[a.label] ||
                                    action.disabled ||
                                    !!success
                                }
                                className={cn(
                                    "bg-blue-500 text-white p-2 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-70"
                                )}
                            >
                                {isLoading[a.label] ? "Loading..." : a.label}
                            </button>
                        </form>
                    );
                }
            })}

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </div>
    );
}
